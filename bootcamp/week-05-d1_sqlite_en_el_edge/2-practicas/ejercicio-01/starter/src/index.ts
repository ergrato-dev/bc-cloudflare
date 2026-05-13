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
// Ruta: GET /movies?page=1&limit=20&genre=sci-fi
app.get("/movies", async (c) => {
  const page   = Math.max(1, Number(c.req.query("page")  ?? "1"));
  const limit  = Math.min(50, Number(c.req.query("limit") ?? "20"));
  const genre  = c.req.query("genre");
  const offset = (page - 1) * limit;

  // TODO: si genre está definido, usa:
  //   "SELECT * FROM movies WHERE genre = ? ORDER BY year DESC LIMIT ? OFFSET ?"
  //   .bind(genre, limit, offset)
  // Si no está definido, usa:
  //   "SELECT * FROM movies ORDER BY year DESC LIMIT ? OFFSET ?"
  //   .bind(limit, offset)
  // Hint: ambas rutas usan .all<Movie>()
  // TODO: también obtén el total con COUNT(*) para la paginación
  // TODO: devuelve c.json({ movies: results, page, limit, total })
});

// ============================================
// PASO 3: Obtener película por ID
// ============================================
// Ruta: GET /movies/:id
app.get("/movies/:id", async (c) => {
  const id = Number(c.req.param("id"));

  // TODO: usa DB.prepare("SELECT * FROM movies WHERE id = ?").bind(id).first<Movie>()
  // TODO: si null → throw new HTTPException(404, { message: "Movie not found" })
  // TODO: devuelve c.json(movie)
});

// ============================================
// PASO 4: Crear película
// ============================================
// Ruta: POST /movies
app.post("/movies", zValidator("json", movieSchema), async (c) => {
  const { title, director, genre, year, rating } = c.req.valid("json");

  // TODO: usa INSERT INTO movies (title, director, genre, year, rating)
  //   VALUES (?, ?, ?, ?, ?) RETURNING *
  //   .bind(title, director, genre, year, rating ?? 0)
  //   .first<Movie>()
  // TODO: devuelve c.json(movie, 201)
});

// ============================================
// PASO 4: Actualizar película
// ============================================
// Ruta: PUT /movies/:id
app.put("/movies/:id", zValidator("json", movieSchema), async (c) => {
  const id                                        = Number(c.req.param("id"));
  const { title, director, genre, year, rating }  = c.req.valid("json");

  // TODO: UPDATE movies SET title=?, director=?, genre=?, year=?, rating=?
  //   WHERE id = ? RETURNING *
  //   .bind(title, director, genre, year, rating ?? 0, id)
  //   .first<Movie>()
  // TODO: si null → HTTPException(404)
  // TODO: devuelve c.json(updated)
});

// ============================================
// PASO 5: Eliminar película — usar batch
// ============================================
// Ruta: DELETE /movies/:id
// El batch actualiza el contador en stats al mismo tiempo
app.delete("/movies/:id", async (c) => {
  const id = Number(c.req.param("id"));

  // TODO: verifica que la película existe antes de borrar
  // TODO: usa DB.batch([
  //   DB.prepare("DELETE FROM movies WHERE id = ?").bind(id),
  //   DB.prepare("UPDATE stats SET value = value - 1 WHERE key = 'count'"),
  // ])
  // TODO: devuelve c.json({ deleted: id })
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
