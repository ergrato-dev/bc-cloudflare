import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import postgres from "postgres";

// ============================================
// PROYECTO SEMANAL: API REST con Hyperdrive
// Semana 09 — Hyperdrive y Bases de Datos Externas
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Renombra "records" por tu entidad (rooms, patients, boats, books…)
// Ajusta los campos del schema según tu dominio.
//
// Ejemplos de adaptación:
//   Escape room         → /rooms, /rooms/:id
//   Marina deportiva    → /boats, /boats/:id
//   Clínica veterinaria → /patients, /patients/:id

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con HYPERDRIVE: Hyperdrive
type Bindings = {
  // TODO
};

// TODO: Define el tipo Record con los campos de tu dominio
// Mínimo: id, name, active, created_at
type Record = {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  created_at: string;
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// TODO: GET /records — listar entidades activas
// Hint: SELECT * FROM records WHERE active = true ORDER BY name
// Requisito avanzado: devolver header X-Query-Ms con la duración en ms
// ============================================

app.get("/records", async (c) => {
  // TODO: implementar
});

// ============================================
// TODO: GET /records/:id — obtener por ID
// Hint: SELECT * FROM records WHERE id = ${id} AND active = true
// Devuelve 404 si no existe
// ============================================

app.get("/records/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);
  // TODO: implementar
});

// TODO: Define el schema Zod para crear un registro
// Incluye los campos propios de tu dominio
const createSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  // TODO: agrega campos adicionales según tu dominio
});

// ============================================
// TODO: POST /records — crear registro con Zod
// Devuelve { id } con status 201
// ============================================

app.post("/records", zValidator("json", createSchema), async (c) => {
  const data = c.req.valid("json");
  // TODO: implementar INSERT con los campos de tu dominio
});

// TODO: Define el schema Zod para actualización parcial
const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  // TODO: agrega campos adicionales según tu dominio
});

// ============================================
// TODO: PATCH /records/:id — actualización parcial
// Solo actualiza los campos enviados en el body
// ============================================

app.patch("/records/:id", zValidator("json", updateSchema), async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);
  const data = c.req.valid("json");
  // TODO: implementar UPDATE dinámico
});

// ============================================
// TODO: DELETE /records/:id — soft delete
// UPDATE records SET active = false WHERE id = ${id}
// ============================================

app.delete("/records/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);
  // TODO: implementar
});

export default app;
