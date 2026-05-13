# Workers KV — TTL, Metadata y Listado Avanzado

## Objetivos

- Controlar la expiración de entradas con `expirationTtl` y `expiration`
- Adjuntar metadata a las entradas para leer sin deserializar el valor
- Paginar resultados grandes con cursor en `KV.list()`
- Aplicar el patrón de llave compuesta para namespacing dentro de un namespace

---

## 1. TTL — Tiempo de Vida

KV borra automáticamente las entradas cuando expiran:

```typescript
// expirationTtl: segundos desde ahora
await c.env.KV.put("session:abc123", JSON.stringify(payload), {
  expirationTtl: 3600, // expira en 1 hora
});

// expiration: timestamp Unix absoluto
const expiresAt = Math.floor(Date.now() / 1000) + 86400; // 24 horas
await c.env.KV.put("token:xyz", token, { expiration: expiresAt });
```

> El TTL mínimo es **60 segundos**. Valores menores se ignoran o producen error.

---

## 2. Metadata

La metadata es un objeto JSON pequeño (≤1024 bytes) adjunto a la llave.
Se puede leer **sin** deserializar el valor principal — útil para filtros rápidos:

```typescript
// Guardar con metadata
await c.env.KV.put(
  "products:42",
  JSON.stringify({ id: 42, name: "Teclado Mecánico", price: 89.99 }),
  { metadata: { category: "periféricos", inStock: true, updatedAt: new Date().toISOString() } }
);

// Leer valor + metadata juntos
const entry = await c.env.KV.getWithMetadata<{ category: string; inStock: boolean }>(
  "products:42",
  { type: "json" }
);
// entry.value   → el objeto del producto (tipado)
// entry.metadata → { category: "periféricos", inStock: true, ... }
```

---

## 3. Metadata en KV.list()

Las llaves listadas incluyen la metadata si se guardó con ella:

```typescript
const result = await c.env.KV.list<{ category: string; inStock: boolean }>({
  prefix: "products:",
  limit:  50,
});

// Filtrar solo productos en stock sin leer cada valor
const inStock = result.keys.filter((k) => k.metadata?.inStock === true);
```

---

## 4. Paginación con cursor

`KV.list()` devuelve máximo 1000 llaves. Para conjuntos grandes usa cursor:

```typescript
async function getAllKeys(kv: KVNamespace, prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor: string | undefined;

  do {
    const result = await kv.list({ prefix, limit: 1000, cursor });
    keys.push(...result.keys.map((k) => k.name));
    cursor = result.list_complete ? undefined : result.cursor;
  } while (cursor);

  return keys;
}
```

---

## 5. Patrón de llaves compuestas

Diseña llaves con múltiples segmentos para filtros eficientes:

```
users:{userId}:profile          → perfil del usuario
users:{userId}:sessions:{id}    → sesiones del usuario
products:{category}:{id}        → por categoría
cache:{routeHash}               → respuestas cacheadas
```

> Mantén las llaves cortas — el tamaño máximo de una llave es **512 bytes**.

---

## ✅ Checklist

- [ ] ¿Usas `expirationTtl` (relativo) o `expiration` (absoluto) según el caso de uso?
- [ ] ¿Guardas en metadata solo datos de filtrado, no el objeto completo?
- [ ] ¿Tu patrón de llaves permite listar eficientemente con prefijo?
- [ ] ¿Manejas `list_complete = false` para evitar resultados truncados?

## Referencias

- [KV — Values and metadata](https://developers.cloudflare.com/kv/api/write-key-value-pairs/)
- [KV — List keys](https://developers.cloudflare.com/kv/api/list-keys/)
