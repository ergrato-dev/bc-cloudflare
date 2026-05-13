import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

// ============================================
// TIPOS Y BINDINGS
// ============================================

type Env = {
  DB: D1Database;
};

type Movie = {
  id: number;
  title: string;
  director: string;
  genre: string;
  year: number;
  rating: number;
  available: number;
};

const movieSchema = z.object({
  title:    z.string().min(1).max(200),
  director: z.string().min(1).max(100),
  genre:    z.string().min(1).max(50),
  year:     z.number().int().min(1888).max(2100),
  rating:   z.number().min(0).max(10).optional(),
});

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 2: Listar películas con paginación y filtro
// ============================================
app.get("/movies", async (c) => {
  const page   = Math.max(1, Number(c.req.query("page")  ?? "1"));
  const limit  = Math.min(50, Number(c.req.query("limit") ?? "20"));
  const genre  = c.req.query("genre");
  const offset = (page - 1) * limit;

  // Consulta con o sin filtro de género — siempre prepared statement
  const listStmt = genre
    ? c.env.DB.prepare(
        "SELECT * FROM movies WHERE genre = ? ORDER BY year DESC LIMIT ? OFFSET ?"
      ).bind(genre, limit, offset)
    : c.env.DB.prepare(
        "SELECT * FROM movies ORDER BY year DESC LIMIT ? OFFSET ?"
      ).bind(limit, offset);

  const countStmt = genre
    ? c.env.DB.prepare(
        "SELECT COUNT(*) AS total FROM movies WHERE genre = ?"
      ).bind(genre)
    : c.env.DB.prepare("SELECT COUNT(*) AS total FROM movies");

  // Batch para ejecutar ambas queries en un solo round-trip
  const [listResult, countResult] = await c.env.DB.batch<Movie | { total: number }>([
    listStmt,
    countStmt,
  ]);

  const movies = (listResult as D1Result<Movie>).results;
  const total  = ((countResult as D1Result<{ total: number }>).results[0] as { total: number }).total;

  return c.json({ movies, page, limit, total });
});

// ============================================
// PASO 3: Obtener película por ID
// ============================================
app.get("/movies/:id", async (c) => {
  const id    = Number(c.req.param("id"));
  const movie = await c.env.DB
    .prepare("SELECT * FROM movies WHERE id = ?")
    .bind(id)
    .first<Movie>();

  if (!movie) throw new HTTPException(404, { message: "Movie not found" });

  return c.json(movie);
});

// ============================================
// PASO 4: Crear película
// ============================================
app.post("/movies", zValidator("json", movieSchema), async (c) => {
  const { title, director, genre, year, rating } = c.req.valid("json");

  const movie = await c.env.DB
    .prepare(
      "INSERT INTO movies (title, director, genre, year, rating) VALUES (?, ?, ?, ?, ?) RETURNING *"
    )
    .bind(title, director, genre, year, rating ?? 0)
    .first<Movie>();

  // Actualiza el contador de stats
  await c.env.DB
    .prepare("UPDATE stats SET value = value + 1 WHERE key = 'count'")
    .run();

  return c.json(movie, 201);
});

// ============================================
// PASO 4: Actualizar película
// ============================================
app.put("/movies/:id", zValidator("json", movieSchema), async (c) => {
  const id                                       = Number(c.req.param("id"));
  const { title, director, genre, year, rating } = c.req.valid("json");

  const updated = await c.env.DB
    .prepare(
      "UPDATE movies SET title=?, director=?, genre=?, year=?, rating=? WHERE id=? RETURNING *"
    )
    .bind(title, director, genre, year, rating ?? 0, id)
    .first<Movie>();

  if (!updated) throw new HTTPException(404, { message: "Movie not found" });

  return c.json(updated);
});

// ============================================
// PASO 5: Eliminar película — batch atómico
// ============================================
app.delete("/movies/:id", async (c) => {
  const id = Number(c.req.param("id"));

  // Verificar existencia antes de borrar
  const exists = await c.env.DB
    .prepare("SELECT id FROM movies WHERE id = ?")
    .bind(id)
    .first<{ id: number }>();

  if (!exists) throw new HTTPException(404, { message: "Movie not found" });

  // Batch: borra película y decrementa contador en un solo viaje
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM movies WHERE id = ?").bind(id),
    c.env.DB.prepare("UPDATE stats SET value = value - 1 WHERE key = 'count'"),
  ]);

  return c.json({ deleted: id });
});

// ============================================
// Stats — cuántas películas hay
// ============================================
app.get("/stats", async (c) => {
  const row = await c.env.DB
    .prepare("SELECT value FROM stats WHERE key = 'count'")
    .first<{ value: number }>();
  return c.json({ total: row?.value ?? 0 });
});

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
