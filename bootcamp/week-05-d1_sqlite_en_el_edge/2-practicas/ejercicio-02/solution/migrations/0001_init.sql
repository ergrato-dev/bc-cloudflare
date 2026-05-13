-- Migración generada por drizzle-kit desde src/db/schema.ts
CREATE TABLE IF NOT EXISTS `games` (
  `id`       integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `title`    text NOT NULL,
  `studio`   text NOT NULL,
  `genre`    text NOT NULL,
  `platform` text NOT NULL,
  `year`     integer NOT NULL,
  `price`    real NOT NULL,
  `in_stock` integer DEFAULT 1
);

CREATE INDEX IF NOT EXISTS `idx_games_genre`    ON `games` (`genre`);
CREATE INDEX IF NOT EXISTS `idx_games_platform` ON `games` (`platform`);
