-- migrations/0001_init.sql
CREATE TABLE IF NOT EXISTS movies (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  title     TEXT    NOT NULL,
  director  TEXT    NOT NULL,
  genre     TEXT    NOT NULL,
  year      INTEGER NOT NULL,
  rating    REAL    DEFAULT 0,
  available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS stats (
  key   TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO stats (key, value) VALUES ('count', 0);

CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);
CREATE INDEX IF NOT EXISTS idx_movies_year  ON movies(year DESC);
