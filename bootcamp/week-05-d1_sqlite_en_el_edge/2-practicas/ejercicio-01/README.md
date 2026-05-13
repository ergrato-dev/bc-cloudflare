# Ejercicio 01 — D1 Raw SQL con Prepared Statements

Construirás una **API de catálogo de películas** que usa D1 directamente con
prepared statements: sin ORMs, sin librerías adicionales.

---

## Contexto

D1 expone la API `prepare → bind → first/all/run`.
Tu misión: conectar cada ruta de Hono a la base de datos usando esa API
de forma segura (nunca concatenación de strings).

---

### Paso 1: Aplicar migraciones y seed en local

```bash
cd starter
pnpm install

# Aplica el schema (crea la tabla movies)
wrangler d1 migrations apply movies-db --local

# Carga las 20 películas de prueba
wrangler d1 execute movies-db --local --file=./seed.sql
```

Después arrancar el dev server:

```bash
wrangler dev
```

---

### Paso 2: Listar películas con paginación

```typescript
// GET /movies?page=1&genre=sci-fi
app.get("/movies", async (c) => {
  const page   = Math.max(1, Number(c.req.query("page")  ?? "1"));
  const limit  = Math.min(50, Number(c.req.query("limit") ?? "20"));
  const genre  = c.req.query("genre");
  const offset = (page - 1) * limit;

  // Hint: si genre está definido, añade WHERE genre = ? al query
  const { results } = await c.env.DB
    .prepare("SELECT * FROM movies ORDER BY year DESC LIMIT ? OFFSET ?")
    .bind(limit, offset)
    .all<Movie>();

  return c.json({ movies: results, page, limit });
});
```

**Completa el TODO del Paso 2** — soporta filtro opcional por genre.

---

### Paso 3: Obtener una película por ID

```typescript
app.get("/movies/:id", async (c) => {
  const id    = Number(c.req.param("id"));
  // Hint: usa .prepare("SELECT * FROM movies WHERE id = ?").bind(id).first<Movie>()
  // Si null → HTTPException(404)
});
```

**Completa el TODO del Paso 3**.

---

### Paso 4: Crear y actualizar

```typescript
// POST /movies — INSERT RETURNING *
app.post("/movies", zValidator("json", movieSchema), async (c) => {
  const { title, director, genre, year } = c.req.valid("json");
  const movie = await c.env.DB
    .prepare(
      "INSERT INTO movies (title, director, genre, year) VALUES (?, ?, ?, ?) RETURNING *"
    )
    .bind(title, director, genre, year)
    .first<Movie>();
  return c.json(movie, 201);
});
```

**Completa los TODOs de Paso 4** — POST y PUT.

---

### Paso 5: Batch — actualizar y registrar en estadísticas

```typescript
// DELETE /movies/:id — borra y decrementa contador en batch
app.delete("/movies/:id", async (c) => {
  const id = Number(c.req.param("id"));
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM movies WHERE id = ?").bind(id),
    c.env.DB.prepare("UPDATE stats SET value = value - 1 WHERE key = 'count'"),
  ]);
  return c.json({ deleted: id });
});
```

**Completa el TODO del Paso 5** — usa batch en el DELETE.

---

### Verificar

```bash
curl http://localhost:8787/movies
curl "http://localhost:8787/movies?genre=sci-fi"
curl http://localhost:8787/movies/1
curl -X POST http://localhost:8787/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Dune","director":"Denis Villeneuve","genre":"sci-fi","year":2021}'
```
