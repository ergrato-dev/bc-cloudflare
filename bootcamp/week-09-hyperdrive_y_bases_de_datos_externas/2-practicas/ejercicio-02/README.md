# Ejercicio 02 — Caching de Queries con Hyperdrive

## Objetivo

Observar la diferencia de latencia entre queries cacheadas y no cacheadas,
y entender qué tipos de consultas Hyperdrive puede cachear.

---

## Contexto

Hyperdrive cachea automáticamente las respuestas de **queries de solo lectura**
que cumplen ciertas condiciones. Este ejercicio compara en tiempo real:

| Ruta             | Tipo de query          | ¿Cacheable? |
|------------------|------------------------|-------------|
| `GET /catalog`   | SELECT plano           | ✅ Sí        |
| `GET /catalog/live`   | SELECT en transacción  | ❌ No        |
| `GET /catalog/random` | ORDER BY RANDOM()      | ❌ No        |
| `GET /catalog/stats`  | NOW() en SELECT        | ❌ No        |

Todas las rutas devuelven el header `X-Query-Ms` con el tiempo de ejecución.
La segunda llamada a `/catalog` debería ser significativamente más rápida.

---

## Paso 1: Configurar caching en wrangler.jsonc

El caching se activa por binding. Agrega la sección `"caching"`:

```jsonc
"hyperdrive": [
  {
    "binding": "HYPERDRIVE",
    "id": "TU_HYPERDRIVE_ID",
    "localConnectionString": "...",
    "caching": {
      "disabled": false,
      "maxAge": 60,
      "staleWhileRevalidate": 15
    }
  }
]
```

**Abre `starter/wrangler.jsonc`** y completa el TODO del bloque `caching`.

---

## Paso 2: Función helper measureQuery

Esta función mide cuántos milisegundos tarda en ejecutarse cualquier operación:

```typescript
async function measureQuery<T>(
  fn: () => Promise<T>
): Promise<{ result: T; ms: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}
```

Ya está incluida en el starter — no necesitas implementarla.

---

## Paso 3: GET /catalog — query cacheable

```typescript
app.get("/catalog", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const { result: products, ms } = await measureQuery(() =>
      sql<Product[]>`SELECT id, name, price, stock FROM products WHERE active = true ORDER BY name`
    );
    c.header("X-Query-Ms", String(ms));
    return c.json({ products, queryMs: ms });
  } finally {
    await sql.end();
  }
});
```

**Abre `starter/src/index.ts`** y completa el TODO del GET /catalog.

---

## Paso 4: GET /catalog/live — SELECT en transacción (no cacheable)

Una transacción activa desactiva el caching aunque la query sea idéntica.

```typescript
const products = await sql.begin((tx) =>
  tx<Product[]>`SELECT id, name, price, stock FROM products WHERE active = true ORDER BY name`
);
```

**Completa el TODO del GET /catalog/live.**

---

## Paso 5: GET /catalog/random y GET /catalog/stats

`ORDER BY RANDOM()` y el uso de `NOW()` hacen que la query no sea cacheable
porque su resultado cambia entre invocaciones.

**Completa los TODOs de `/catalog/random` y `/catalog/stats`.**

---

## Paso 6: Comparar tiempos

```bash
cd starter
pnpm install
pnpm dev

# Primera llamada — sin caché
curl -i http://localhost:8787/catalog

# Segunda llamada — desde caché (debería ser más rápida en producción)
curl -i http://localhost:8787/catalog

# No cacheable — siempre va al DB
curl -i http://localhost:8787/catalog/live
curl -i http://localhost:8787/catalog/random
curl -i http://localhost:8787/catalog/stats
```

> **Nota**: En `wrangler dev` local, el caching no actúa igual que en producción.
> La diferencia real se observa al desplegar con `wrangler deploy`.

---

## Criterios de éxito

- [ ] `wrangler.jsonc` tiene la sección `caching` correctamente configurada
- [ ] `GET /catalog` devuelve header `X-Query-Ms`
- [ ] `GET /catalog/live` usa `sql.begin()` y devuelve el mismo header
- [ ] `GET /catalog/stats` incluye `COUNT(*)`, `AVG(price)` y `NOW()`
- [ ] En producción, la segunda llamada a `/catalog` es notablemente más rápida
