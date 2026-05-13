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
// Ruta: GET /games?page=1&limit=20&genre=rpg
app.get("/games", async (c) => {
  const page  = Math.max(1, Number(c.req.query("page")  ?? "1"));
  const limit = Math.min(50, Number(c.req.query("limit") ?? "20"));
  const genre = c.req.query("genre");

  const db = drizzle(c.env.DB);

  // TODO: construye la query usando db.select().from(games)
  // TODO: si genre está definido, añade .where(eq(games.genre, genre))
  // TODO: añade .limit(limit).offset((page - 1) * limit)
  // TODO: devuelve c.json({ games: results, page, limit })
});

// ============================================
// PASO 3: Obtener videojuego por ID
// ============================================
// Ruta: GET /games/:id
app.get("/games/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  // TODO: usa db.select().from(games).where(eq(games.id, id))
  // TODO: destructura el resultado: const [game] = await ...
  // TODO: si game es undefined → throw new HTTPException(404, { message: "Game not found" })
  // TODO: devuelve c.json(game)
});

// ============================================
// PASO 4: Crear videojuego
// ============================================
// Ruta: POST /games
app.post("/games", zValidator("json", gameSchema), async (c) => {
  const data: NewGame = c.req.valid("json");
  const db = drizzle(c.env.DB);

  // TODO: usa db.insert(games).values(data).returning()
  // TODO: destructura: const [created] = await ...
  // TODO: devuelve c.json(created, 201)
});

// ============================================
// PASO 4: Actualizar videojuego
// ============================================
// Ruta: PUT /games/:id
app.put("/games/:id", zValidator("json", gameSchema), async (c) => {
  const id   = Number(c.req.param("id"));
  const data = c.req.valid("json");
  const db   = drizzle(c.env.DB);

  // TODO: usa db.update(games).set(data).where(eq(games.id, id)).returning()
  // TODO: destructura: const [updated] = await ...
  // TODO: si updated es undefined → HTTPException(404)
  // TODO: devuelve c.json(updated)
});

// ============================================
// PASO 5: Eliminar videojuego
// ============================================
// Ruta: DELETE /games/:id
app.delete("/games/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const db = drizzle(c.env.DB);

  // TODO: verifica que el juego existe (usa .select + .where + destructuring)
  // TODO: usa db.delete(games).where(eq(games.id, id))
  // TODO: devuelve c.json({ deleted: id })
});

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
