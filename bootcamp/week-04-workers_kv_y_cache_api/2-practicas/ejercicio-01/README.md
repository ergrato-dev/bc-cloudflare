# Ejercicio 01 — KV CRUD con Prefijos y Metadata

Construirás una API de **librería de cómics** que usa Workers KV como capa de
almacenamiento: catálogo de cómics con prefijos de llave, TTL y metadata.

---

## Contexto

El starter tiene los tipos y las rutas sin implementar.
Tu misión: conectar cada ruta al binding KV usando los patrones correctos.

---

### Paso 1: Seed — precarga los datos en KV

El Worker tiene una ruta `POST /seed` que precarga el catálogo.
Sin un namespace KV real (en `wrangler dev` es automático), los datos
se almacenan en un KV local temporal.

```typescript
// Patrón de llave: "comics:{id}"
// Guarda con metadata de filtrado rápido
await c.env.COMICS_KV.put(
  `comics:${comic.id}`,
  JSON.stringify(comic),
  {
    metadata: { genre: comic.genre, available: comic.available },
    expirationTtl: 86400, // 24 horas en demo
  }
);
```

**Completa el TODO del Paso 1** — implementa la ruta `POST /seed`.

---

### Paso 2: Listar cómics con filtro por genre

Usa `KV.list()` con prefix y filtra en memoria por la metadata:

```typescript
app.get("/comics", async (c) => {
  const genre = c.req.query("genre");

  const list = await c.env.COMICS_KV.list<ComicMeta>({ prefix: "comics:", limit: 50 });

  // Filtrar por metadata sin leer cada valor
  const keys = genre
    ? list.keys.filter((k) => k.metadata?.genre === genre)
    : list.keys;

  // Leer los valores de las llaves filtradas
  const comics = await Promise.all(
    keys.map((k) => c.env.COMICS_KV.get(k.name, { type: "json" }))
  );
  return c.json({ comics: comics.filter(Boolean), total: comics.length });
});
```

**Completa el TODO del Paso 2** — implementa `GET /comics`.

---

### Paso 3: Obtener un cómic por ID

```typescript
app.get("/comics/:id", async (c) => {
  const id  = c.req.param("id");
  // Hint: usa c.env.COMICS_KV.get(`comics:${id}`, { type: "json" })
  // Si devuelve null → throw new HTTPException(404, ...)
});
```

**Completa el TODO del Paso 3** — implementa `GET /comics/:id`.

---

### Paso 4: Crear y eliminar

```typescript
// POST /comics — guarda con metadata
app.post("/comics", zValidator("json", comicSchema), async (c) => {
  const data = c.req.valid("json");
  const id   = crypto.randomUUID().split("-")[0]; // id corto
  await c.env.COMICS_KV.put(
    `comics:${id}`,
    JSON.stringify({ ...data, id }),
    { metadata: { genre: data.genre, available: data.available } }
  );
  return c.json({ id }, 201);
});

// DELETE /comics/:id
app.delete("/comics/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.COMICS_KV.delete(`comics:${id}`);
  return c.json({ deleted: id });
});
```

**Completa el TODO del Paso 4** — implementa POST y DELETE.

---

### Paso 5: Probar el Worker

```bash
cd starter && pnpm install && wrangler dev
```

```bash
# 1. Cargar datos iniciales
curl -X POST http://localhost:8787/seed

# 2. Listar todos
curl http://localhost:8787/comics

# 3. Filtrar por genre
curl "http://localhost:8787/comics?genre=superhero"

# 4. Obtener por id
curl http://localhost:8787/comics/1

# 5. Crear
curl -X POST http://localhost:8787/comics \
  -H "Content-Type: application/json" \
  -d '{"title":"Saga","author":"Brian K. Vaughan","genre":"sci-fi","year":2012,"available":true}'

# 6. Eliminar
curl -X DELETE http://localhost:8787/comics/1
```
