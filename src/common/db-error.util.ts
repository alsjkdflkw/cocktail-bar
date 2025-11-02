export function isUniqueConstraintViolation(err: any): boolean {
  // Postgres
  if (err?.code === '23505') return true;

  // SQLite
  if (err?.code === 'SQLITE_CONSTRAINT' || err?.errno === 19) return true;

  // MySQL / MariaDB
  if (err?.code === 'ER_DUP_ENTRY' || err?.errno === 1062) return true;

  // Fallback: some drivers expose detail/messages mentioning "unique"
  const msg: string = err?.detail || err?.message || '';
  return /unique|duplicate/i.test(msg);
}