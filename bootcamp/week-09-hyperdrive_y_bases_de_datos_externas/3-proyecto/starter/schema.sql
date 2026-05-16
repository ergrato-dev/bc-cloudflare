-- ============================================
-- PROYECTO SEMANAL — Week 09: Hyperdrive
-- Adapta este schema a tu dominio asignado
-- ============================================
--
-- Renombra la tabla y agrega las columnas de tu dominio.
-- Mantén siempre: id, active, created_at
--
-- Ejemplos de columnas por dominio:
--   Clínica veterinaria  → name, species, owner_name, owner_phone
--   Escape room          → name, capacity, duration_min, difficulty
--   Marina deportiva     → name, length_m, owner_name, berth_number
--   Librería             → title, author, isbn, price, stock
--   Consultorio          → patient_name, doctor_name, scheduled_at, status

-- TODO: Renombra "records" por la entidad de tu dominio (ej: patients, rooms, books)
CREATE TABLE IF NOT EXISTS records (
  id         SERIAL PRIMARY KEY,

  -- TODO: Agrega las columnas propias de tu dominio aquí
  -- Ejemplo: name TEXT NOT NULL,
  --          description TEXT,
  --          price NUMERIC(10, 2),
  name       TEXT NOT NULL,
  description TEXT,

  active     BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TODO: Agrega índices relevantes para tus consultas frecuentes
CREATE INDEX IF NOT EXISTS records_active_idx ON records (active);
