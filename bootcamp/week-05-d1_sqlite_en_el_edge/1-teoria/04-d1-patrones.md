# D1 — Patrones Avanzados

## Objetivos

- Ejecutar múltiples queries en un batch atómico con `D1.batch()`
- Implementar paginación eficiente con `LIMIT / OFFSET`
- Crear índices SQL para mejorar el rendimiento de queries frecuentes

## 1. Batch statements

`D1.batch()` ejecuta un array de prepared statements de forma atómica.
Si uno falla, todos fallan. Equivale a una transacción.

```typescript
// Insertar y actualizar en la misma operación atómica
const [newMovie, _] = await c.env.DB.batch([
  c.env.DB.prepare(
    "INSERT INTO movies (title, director, genre, year) VALUES (?, ?, ?, ?) RETURNING *"
  ).bind(title, director, genre, year),

  c.env.DB.prepare(
    "UPDATE stats SET total = total + 1 WHERE key = 'movie_count'"
  ),
]);

const created = newMovie.results[0] as Movie;
```

## 2. Paginación con LIMIT / OFFSET

```typescript
// Parámetros de paginación con valores por defecto seguros
const page  = Math.max(1, Number(c.req.query("page")  ?? "1"));
const limit = Math.min(50, Number(c.req.query("limit") ?? "20"));
const offset = (page - 1) * limit;

const { results: items } = await c.env.DB
  .prepare("SELECT * FROM movies ORDER BY year DESC LIMIT ? OFFSET ?")
  .bind(limit, offset)
  .all<Movie>();

const { total } = await c.env.DB
  .prepare("SELECT COUNT(*) AS total FROM movies")
  .first<{ total: number }>() ?? { total: 0 };

return c.json({ items, page, limit, total, pages: Math.ceil(total / limit) });
```

## 3. Índices y rendimiento

```sql
-- migrations/0002_add_indexes.sql
-- Índice para filtros por genre (lectura frecuente)
CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies(genre);

-- Índice compuesto para ordenación por año y género
CREATE INDEX IF NOT EXISTS idx_movies_year_genre ON movies(year DESC, genre);
```

> Añade índices para columnas que aparecen en `WHERE` o `ORDER BY` frecuentes.
> Los índices ralentizan los INSERTs — úsalos con criterio.

## 4. Búsqueda de texto con LIKE

```typescript
// Búsqueda parcial — prepared statement con comodín
const term = c.req.query("q") ?? "";

const { results } = await c.env.DB
  .prepare("SELECT * FROM movies WHERE title LIKE ? LIMIT 20")
  .bind(`%${term}%`)
  .all<Movie>();
```

> Para búsqueda full-text avanzada combina D1 con Vectorize (semana 11).

## ✅ Checklist

- [ ] ¿Qué garantía transaccional ofrece `D1.batch()`?
- [ ] ¿Cómo calculas el `OFFSET` a partir del número de página?
- [ ] ¿En qué columnas tiene sentido crear un índice y en cuáles no?
- [ ] ¿Por qué el comodín `%term%` en LIKE no evita SQL injection por sí solo?

## Referencias

- [D1 · Batch statements](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch-statements)
- [SQLite · CREATE INDEX](https://www.sqlite.org/lang_createindex.html)
