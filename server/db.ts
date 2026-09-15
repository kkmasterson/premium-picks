import pg from 'pg';

export function databasePool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return null;
  const pool = new pg.Pool({ connectionString, max: 4, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30_000, statement_timeout: 10_000 });
  // Never log pg errors: connection details may contain credentials.
  pool.on('error', () => console.error('database_connection_error'));
  return pool;
}
