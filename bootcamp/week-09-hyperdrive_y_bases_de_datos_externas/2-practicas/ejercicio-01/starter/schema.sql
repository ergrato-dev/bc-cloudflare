-- Semana 09 — Hyperdrive: Schema PostgreSQL
-- Ejecutar una vez en tu base de datos antes de iniciar el ejercicio
-- psql "postgresql://user:pass@host/dbname" -f schema.sql

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_active_idx ON products (active);
CREATE INDEX IF NOT EXISTS products_name_idx   ON products (name);
