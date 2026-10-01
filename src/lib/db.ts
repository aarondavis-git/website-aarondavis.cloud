import { Pool } from 'pg';
import { logger } from './logger';

// A single pooled connection, reused across requests. This matters
// specifically on Vercel: serverless functions can reuse a warm container
// between invocations, and creating a fresh Pool on every request will
// exhaust your Postgres connection limit fast. Caching on globalThis
// survives hot-reload in dev and reuse-between-invocations in production.
declare global {
  var __pgPool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  // Without this, pg silently falls back to localhost:5432 and the first
  // request fails with a confusing ECONNREFUSED.
  logger.warn('DATABASE_URL is not set — database routes will fail. See .env.local.example.');
}

export const pool =
  globalThis.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5, // keep modest — serverless functions can run many concurrent instances
    connectionTimeoutMillis: 5_000, // fail fast instead of hanging the request
    idleTimeoutMillis: 30_000,
    statement_timeout: 10_000,
    // Hosted Postgres (Neon, Supabase, ...) needs SSL in production. A
    // Postgres container on the same Docker network usually has none, so set
    // DATABASE_SSL=false for that case.
    ssl:
      process.env.DATABASE_SSL === 'false'
        ? false
        : process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false } // adjust once you know your host's CA setup
          : undefined,
  });

globalThis.__pgPool = pool;

pool.on('error', (err) => {
  // Fires on idle-client errors (e.g. the DB dropped a connection) —
  // without this handler an unhandled error here can crash the process.
  logger.error({ err }, 'Unexpected Postgres pool error');
});
