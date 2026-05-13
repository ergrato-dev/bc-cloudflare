# Ejercicio 01 — Routing Avanzado y Validación Zod

Construirás una API de una **tienda de videojuegos** usando routing avanzado con
`app.route()` y validación de inputs con `@hono/zod-validator`.

---

## Contexto

La tienda tiene un catálogo de videojuegos y una lista de publishers.
El starter tiene la estructura básica pero sin validación ni grupos de rutas.
Tu misión: modularizar con `app.route()` y validar todos los inputs con Zod.

---

### Paso 1: Routing con path params y query params

Path params para obtener un recurso por ID, query params para filtrar:

```typescript
// Path param: GET /games/:id
app.get("/games/:id", (c) => {
  const id = Number(c.req.param("id"));
  const game = GAMES.find((g) => g.id === id);
  if (!game) return c.json({ error: "No encontrado" }, 404);
  return c.json(game);
});

// Query params: GET /games?genre=rpg&platform=pc
app.get("/games", (c) => {
  const genre    = c.req.query("genre");
  const platform = c.req.query("platform");
  // filtrar GAMES por genre y platform
});
```

**Abre `starter/src/index.ts`** y completa los TODOs del Paso 1.

---

### Paso 2: Validación con zValidator

Valida el body de POST antes de que llegue al handler:

```typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const createGameSchema = z.object({
  title:     z.string().min(2).max(100),
  price:     z.number().positive(),
  genre:     z.enum(["rpg", "fps", "strategy", "sports", "adventure"]),
  platform:  z.enum(["pc", "ps5", "xbox", "switch"]),
  publisher: z.string(),
});

app.post(
  "/games",
  zValidator("json", createGameSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Datos inválidos", details: result.error.issues }, 422);
    }
  }),
  (c) => {
    const data = c.req.valid("json"); // tipado como CreateGame
    return c.json({ ...data, id: Date.now() }, 201);
  }
);
```

**Completa el TODO del Paso 2** — valida el body de `POST /games`.

---

### Paso 3: app.route() para separar publishers

Los publishers son un recurso independiente. Crea un sub-router:

```typescript
const publishersRouter = new Hono<{ Bindings: Env }>();
publishersRouter.get("/",     (c) => c.json({ publishers: PUBLISHERS }));
publishersRouter.get("/:id",  (c) => { /* ... */ });

// Monta el router en la app principal
app.route("/publishers", publishersRouter);
// Resultado: GET /publishers, GET /publishers/:id
```

**Completa el TODO del Paso 3** — crea y monta `publishersRouter`.

---

### Paso 4: Validar query params con Zod

Usa `zValidator("query", schema)` para tipar y validar los filtros:

```typescript
const gamesQuerySchema = z.object({
  genre:    z.string().optional(),
  platform: z.string().optional(),
  limit:    z.coerce.number().int().min(1).max(50).default(20),
  page:     z.coerce.number().int().min(1).default(1),
});

// z.coerce.number() convierte "10" → 10 automáticamente
app.get("/games", zValidator("query", gamesQuerySchema), (c) => {
  const { genre, platform, limit, page } = c.req.valid("query");
  // limit y page son ya number, no string
});
```

**Completa el TODO del Paso 4** — añade `zValidator("query", ...)` a `GET /games`.

---

### Paso 5: Probar el Worker

```bash
cd starter
pnpm install
wrangler dev
```

```bash
# Listar juegos con filtros
curl "http://localhost:8787/games?genre=rpg&limit=5"

# Juego por ID
curl http://localhost:8787/games/1

# ID inválido (no numérico)
curl http://localhost:8787/games/abc

# POST válido
curl -X POST http://localhost:8787/games \
  -H "Content-Type: application/json" \
  -d '{"title":"Elden Ring","price":49.99,"genre":"rpg","platform":"ps5","publisher":"FromSoftware"}'

# POST inválido (precio negativo) → debe devolver 422
curl -X POST http://localhost:8787/games \
  -H "Content-Type: application/json" \
  -d '{"title":"X","price":-10,"genre":"invalid","platform":"pc","publisher":"Test"}'

# Publishers
curl http://localhost:8787/publishers
```
