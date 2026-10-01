import { NextResponse } from 'next/server';
import { pool } from '../../../lib/db';
import { logger } from '../../../lib/logger';

export async function GET() {
  try {
    await pool.query('SELECT 1');
    return NextResponse.json({ status: 'ok', db: 'up', timestamp: new Date().toISOString() });
  } catch (err) {
    logger.error({ err }, 'Health check failed — database unreachable');
    return NextResponse.json(
      { status: 'error', db: 'down', timestamp: new Date().toISOString() },
      { status: 500 },
    );
  }
}
