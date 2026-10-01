// Applies every sql/*.sql file that hasn't been applied yet, in filename
// order (001_..., 002_...). Applied files are recorded in a
// schema_migrations table, so running this twice is safe.
//
//   npm run db:migrate
//
// Reads DATABASE_URL from .env.local if present (see the db:migrate script in
// package.json); a DATABASE_URL already in the environment takes precedence. To add a change later, create sql/002_<name>.sql — never
// edit a file that has already been applied.

import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Add it to .env.local first.');
  process.exit(1);
}

const sqlDir = path.join(process.cwd(), 'sql');
const files = fs
  .readdirSync(sqlDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

// Same SSL rule as src/lib/db.ts: off for a local Docker Postgres
// (DATABASE_SSL=false), otherwise let the connection string decide
// (hosted providers include ?sslmode=require).
const client = new pg.Client({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'false' ? false : undefined,
});
await client.connect();

try {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename   TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  const { rows } = await client.query('SELECT filename FROM schema_migrations');
  const applied = new Set(rows.map((r) => r.filename));

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(sqlDir, file), 'utf8');
    console.log(`Applying ${file} ...`);
    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      count += 1;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }
  console.log(count === 0 ? 'Database is up to date.' : `Applied ${count} migration(s).`);
} catch (err) {
  console.error('Migration failed:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
