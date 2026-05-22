CREATE TABLE IF NOT EXISTS documents (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  r2_key     TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
