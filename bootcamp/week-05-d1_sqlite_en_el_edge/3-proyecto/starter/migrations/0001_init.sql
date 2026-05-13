-- TODO 3: Reemplaza este archivo con el SQL generado por drizzle-kit
-- Ejecuta: pnpm db:generate  →  verás el SQL aquí
-- Luego: pnpm db:migrate:local  para aplicar localmente

-- Ejemplo para una tabla de pacientes veterinarios:
-- CREATE TABLE IF NOT EXISTS `patients` (
--   `id`         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
--   `name`       text NOT NULL,
--   `species`    text NOT NULL,
--   `breed`      text NOT NULL,
--   `age`        integer NOT NULL,
--   `owner_name` text NOT NULL
-- );
-- CREATE INDEX IF NOT EXISTS `idx_patients_species` ON `patients` (`species`);

-- Tabla de estadísticas para el batch del DELETE
CREATE TABLE IF NOT EXISTS stats (
  key   TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);
INSERT OR IGNORE INTO stats (key, value) VALUES ('count', 0);
