# Ejercicio 02 — Cache API con caches.default

Construirás una API de **directorio de países** que cachea respuestas HTTP
usando `caches.default` — sin ningún binding KV.

---

## Contexto

La Cache API trabaja con objetos `Request`/`Response` del estándar web.
Debes usar `c.req.raw` (el `Request` nativo) dentro de Hono, y
`c.executionCtx.waitUntil` para el guardado en background.

---

### Paso 1: Caché con HIT / MISS

```typescript
// Patrón completo de cache-aside con Cache API
const cache    = caches.default;
const cacheKey = c.req.raw; // URL completa como llave de caché

const cached = await cache.match(cacheKey);
if (cached) return cached; // HIT — sin cómputo
```

**Abre `starter/src/index.ts`** y completa el TODO del Paso 1 en `GET /countries`.

---

### Paso 2: Guardar con Cache-Control en background

```typescript
// Construye la respuesta con header Cache-Control
const response = new Response(JSON.stringify({ countries: data }), {
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=300", // 5 minutos
    "X-Cache": "MISS",
  },
});

// waitUntil: no bloquea la respuesta al cliente
// SIEMPRE .clone() — el body solo puede consumirse una vez
c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
return response;
```

**Completa el TODO del Paso 2** — guarda la respuesta en caché con `waitUntil`.

---

### Paso 3: Caché por país (:code) con TTL mayor

```typescript
// Respuestas por recurso individual pueden tener TTL más largo
const response = new Response(JSON.stringify(country), {
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=600", // 10 minutos
    "X-Cache": "MISS",
  },
});
c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
return response;
```

**Completa el TODO del Paso 3** — implementa `GET /countries/:code`.

---

### Paso 4: Purga manual de caché

```typescript
// DELETE /cache/countries invalida la caché de la ruta de listado
app.delete("/cache/countries", async (c) => {
  const cache    = caches.default;
  const listUrl  = new URL("/countries", c.req.url).toString();
  const deleted  = await cache.delete(listUrl);
  return c.json({ purged: deleted, url: listUrl });
});
```

**Completa el TODO del Paso 4** — implementa la ruta de purga.

---

### Paso 5: Verificar el comportamiento

```bash
cd starter && pnpm install && wrangler dev
```

```bash
# Primera petición → MISS (mira el header X-Cache)
curl -i http://localhost:8787/countries

# Segunda petición → HIT (respuesta desde caché)
curl -i http://localhost:8787/countries

# Un país concreto
curl -i http://localhost:8787/countries/es

# Purgar caché
curl -X DELETE http://localhost:8787/cache/countries

# Siguiente petición → MISS de nuevo
curl -i http://localhost:8787/countries
```
