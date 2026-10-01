import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { logger } from '../../../lib/logger';
import { CONTACT_LIMITS, RATE_LIMIT } from '../../../lib/contact';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 16 * 1024;

// The raw IP is personal data (GDPR), so only a salted hash is stored — enough
// to rate-limit a client without keeping its address.
function clientHash(request: NextRequest): string | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim();
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT ?? '';
  return createHash('sha256').update(salt + ip).digest('hex').slice(0, 32);
}

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: NextRequest) {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return fail('Expected a JSON body.', 415);
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return fail('Message is too long.', 413);
    body = JSON.parse(text);
  } catch {
    return fail('Invalid request body', 400);
  }
  if (typeof body !== 'object' || body === null) return fail('Invalid request body', 400);

  const { name, email, message, company } = body as Record<string, unknown>;

  // Honeypot: a real visitor never sees or fills this field (hidden via CSS
  // on the form), so any submission with it filled in is almost certainly a
  // bot. Silently report success without touching the database.
  if (typeof company === 'string' && company.trim() !== '') {
    logger.warn('Contact form honeypot triggered');
    return NextResponse.json({ ok: true });
  }

  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return fail('Please fill in all fields with a valid email.', 400);
  }
  const clean = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
  };
  if (!clean.name || !clean.message || !EMAIL_RE.test(clean.email)) {
    return fail('Please fill in all fields with a valid email.', 400);
  }
  if (
    clean.name.length > CONTACT_LIMITS.name ||
    clean.email.length > CONTACT_LIMITS.email ||
    clean.message.length > CONTACT_LIMITS.message
  ) {
    return fail(`Please keep your message under ${CONTACT_LIMITS.message} characters.`, 400);
  }

  const ipHash = clientHash(request);
  const userAgent = request.headers.get('user-agent')?.slice(0, 500) ?? null;

  try {
    if (ipHash) {
      const { rows } = await pool.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM contact_submissions
          WHERE ip_hash = $1 AND created_at > now() - make_interval(mins => $2)`,
        [ipHash, RATE_LIMIT.windowMinutes],
      );
      if (rows[0].n >= RATE_LIMIT.max) {
        logger.warn({ ipHash }, 'Contact form rate limit hit');
        return fail("You've sent a few messages already — please try again later or email me directly.", 429);
      }
    }

    const { rows } = await pool.query<{ id: string }>(
      `INSERT INTO contact_submissions (name, email, message, ip_hash, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [clean.name, clean.email, clean.message, ipHash, userAgent],
    );
    logger.info({ id: rows[0].id }, 'Contact form submitted');
  } catch (err) {
    logger.error({ err }, 'Failed to insert contact submission');
    return fail('Something went wrong. Please try again.', 500);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
