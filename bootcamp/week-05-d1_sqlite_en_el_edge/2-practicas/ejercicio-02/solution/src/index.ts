import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { games } from "./db/schema";
import type { NewGame } from "./db/schema";

// ============================================
// TIPOS Y BINDINGS
// ============================================

type Env = {
  DB: D1Database;
};

const gameSchema = z.object({
  title:    z.string().min(1).max(200),
  studio:   z.string().min(1).max(100),
  genre:    z.string().min(1).max(50),
  platform: z.string().min(1).max(50),
  year:     z.number().int().min(1970).max(2100),
  price:    z.number().min(0),
  inStock:  z.boolean().optional(),
});

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 2: Listar videojuegos con paginación
// ============================================
app.get("/games", async (c) => {
  const page  = Math.max(1, Number(c.req.query("page")  ?? "1"));
  const limit = Math.min(50, Number(c.req.query("limit") ?? "20"));
  const genre = c.req.query("genre");

  const db = drizzle(c.env.DB);

  // Construye la query con o sin filtro de género
  const query = db.select().from(games);
  const results = genre
    ? await query.where(eq(games.genre, genre)).limit(limit).offset((page - 1) * limit)
    : await query.limit(limit).offset((page - 1) * limit);

  return c.json({ games: results, page, limit });
});

// ============================================
// PASO 3: Obtener videojuego por ID
// ============================================
app.get("/games/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  // Destructuring del array — game es undefined si no existe
  const [game] = await db.select().from(games).where(eq(games.id, id));

  if (!game) throw new HTTPException(404, { message: "Game not found" });

  return c.json(game);
});

// ============================================
// PASO 4: Crear videojuego
// ============================================
app.post("/games", zValidator("json", gameSchema), async (c) => {
  const data: NewGame = c.req.valid("json");
  const db = drizzle(c.env.DB);

  // .returning() devuelve el registro con el id autogenerado
  const [created] = await db.insert(games).values(data).returning();

  return c.json(created, 201);
});

// ============================================
// PASO 4: Actualizar videojuego
// ============================================
app.put("/games/:id", zValidator("json", gameSchema), async (c) => {
  const id   = Number(c.req.param("id"));
  const data = c.req.valid("json");
  const db   = drizzle(c.env.DB);

  const [updated] = await db
    .update(games)
    .set(data)
    .where(eq(games.id, id))
    .returning();

  if (!updated) throw new HTTPException(404, { message: "Game not found" });

  return c.json(updated);
});

// ============================================
// PASO 5: Eliminar videojuego
// ============================================
app.delete("/games/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  // Verifica existencia antes de borrar
  const [exists] = await db.select({ id: games.id }).from(games).where(eq(games.id, id));

  if (!exists) throw new HTTPException(404, { message: "Game not found" });

  await db.delete(games).where(eq(games.id, id));

  return c.json({ deleted: id });
});

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
