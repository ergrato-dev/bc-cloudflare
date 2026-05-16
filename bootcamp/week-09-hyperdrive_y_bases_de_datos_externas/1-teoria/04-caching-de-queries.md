# Caching de Queries con Hyperdrive

## Objetivos

- Activar el caching automático de queries SELECT en Hyperdrive
- Configurar TTL y `staleWhileRevalidate` en `wrangler.jsonc`
- Identificar qué tipos de queries son cacheables por Hyperdrive

## 1. Cómo funciona el cache de Hyperdrive

Hyperdrive puede cachear el **resultado de queries SELECT** en el edge,
evitando un round-trip al DB en lecturas repetidas dentro del TTL.

```
Worker → Hyperdrive [cache HIT]  → Respuesta inmediata (< 1ms)
Worker → Hyperdrive [cache MISS] → PostgreSQL → Hyperdrive → Worker
```

El cache es por **texto exacto de query + parámetros** — queries distintas
tienen entradas de cache independientes.

## 2. Activar caching en wrangler.jsonc

```jsonc
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "a1b2c3d4e5f6789abc",
      "caching": {
        "disabled": false,
        "maxAge": 60,               // TTL en segundos (default: 60)
        "staleWhileRevalidate": 15  // Segundos extra sirviendo stale mientras revalida
      }
    }
  ]
}
```

> `staleWhileRevalidate` permite servir datos ligeramente expirados mientras se
> refresca el cache en segundo plano — reduce latencia pico sin sacrificar frescura.

## 3. Queries cacheables vs no cacheables

| Tipo | ¿Cacheable? | Motivo |
|------|-------------|--------|
| `SELECT` sin transacción | ✅ Sí | Solo lectura, determinístico |
| `SELECT` con `NOW()` o `RANDOM()` | ❌ No | No determinístico |
| `INSERT / UPDATE / DELETE` | ❌ No | Muta datos |
| Queries dentro de `BEGIN...COMMIT` | ❌ No | Estado transaccional |

## 4. Cache selectivo con dos configs

Si necesitas cache en algunos endpoints y no en otros, usa dos Hyperdrive configs:

```jsonc
{
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE_CACHED",
      "id": "config-con-cache",
      "caching": { "disabled": false, "maxAge": 60 }
    },
    {
      "binding": "HYPERDRIVE_FRESH",
      "id": "config-sin-cache",
      "caching": { "disabled": true }
    }
  ]
}
```

```typescript
type Bindings = {
  HYPERDRIVE_CACHED: Hyperdrive;
  HYPERDRIVE_FRESH: Hyperdrive;
};

// Catálogo de productos → usa cache
app.get("/catalog", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE_CACHED.connectionString, { max: 5 });
  // ...
});

// Inventario en tiempo real → sin cache
app.get("/inventory", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE_FRESH.connectionString, { max: 5 });
  // ...
});
```

## ✅ Checklist

- [ ] ¿Qué tipo de queries puede cachear Hyperdrive automáticamente?
- [ ] ¿Qué significa `staleWhileRevalidate` y cuándo es útil?
- [ ] ¿Por qué `SELECT NOW()` no es cacheable por Hyperdrive?
- [ ] ¿Cómo separarías endpoints con y sin cache en el mismo Worker?

## Referencias

- [Hyperdrive · Query caching](https://developers.cloudflare.com/hyperdrive/configuration/query-caching/)
- [Hyperdrive · Limits](https://developers.cloudflare.com/hyperdrive/reference/limits/)
