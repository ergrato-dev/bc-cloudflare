import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";

// ============================================
// PROYECTO SEMANAL: Catálogo con D1 + DrizzleORM
// Semana 05 — D1: SQLite en el Edge
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker al dominio asignado por tu instructor.
// Renombra "items" por la entidad de tu dominio:
//   Clínica veterinaria → patients
//   Escape room         → rooms
//   Marina deportiva    → boats
//   Biblioteca          → books

// TODO 5: Importa tu tabla y tipos desde schema.ts
// import { items } from "./db/schema";
// import type { Item, NewItem } from "./db/schema";

type Env = {
  CATALOG_DB: D1Database;
};

// TODO 6: Define el schema Zod para validar la creación/actualización
// Debe incluir todos los campos obligatorios de tu tabla
const itemSchema = z.object({
  name:     z.string().min(1).max(200),
  category: z.string().min(1).max(50),
  // TODO: agrega los campos específicos de tu dominio
});

const app = new Hono<{ Bindings: Env }>();

// ============================================
// TODO 7: GET /items — listado con paginación y filtro
// ============================================
// Soportar: ?page=1 ?limit=20 ?category=valor
// Hint: usa drizzle(c.env.CATALOG_DB), db.select().from(items)
// Hint: filtro opcional con .where(eq(items.category, category))
// Hint: .limit(limit).offset((page - 1) * limit)
app.get("/items", async (c) => {
  // TODO: implementar
});

// ============================================
// TODO 7: GET /items/:id — obtener por ID
// ============================================
// Hint: const [item] = await db.select().from(items).where(eq(items.id, id))
// Hint: si undefined → HTTPException(404)
app.get("/items/:id", async (c) => {
  // TODO: implementar
});

// ============================================
// TODO 8: POST /items — crear con validación Zod
// ============================================
// Hint: db.insert(items).values(data).returning()
// Hint: const [created] = await ...
app.post("/items", zValidator("json", itemSchema), async (c) => {
  // TODO: implementar
});

// ============================================
// TODO 8: PUT /items/:id — actualizar
// ============================================
app.put("/items/:id", zValidator("json", itemSchema), async (c) => {
  // TODO: implementar
});

// ============================================
// TODO 9: DELETE /items/:id — borrar con batch
// ============================================
// El batch debe: borrar el ítem Y decrementar stats.count en un solo viaje
// Hint: c.env.CATALOG_DB.batch([stmt1, stmt2])
app.delete("/items/:id", async (c) => {
  // TODO: implementar
});

// ============================================
// Stats — cuántos ítems hay en total
// ============================================
app.get("/stats", async (c) => {
  const row = await c.env.CATALOG_DB
    .prepare("SELECT value FROM stats WHERE key = 'count'")
    .first<{ value: number }>();
  return c.json({ total: row?.value ?? 0 });
});

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
