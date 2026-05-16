# Consultas SQL con postgres.js en Workers

## Objetivos

- Instalar y configurar `postgres` (postgres.js) para el runtime de Workers
- Ejecutar SELECT, INSERT, UPDATE y DELETE con template literals type-safe
- Manejar errores de DB sin filtrar detalles internos al cliente

## 1. Instalar el driver

```bash
pnpm add postgres@3.4.9
```

`postgres.js` incluye un export especial `workedge` para Cloudflare Workers
que elimina las dependencias de Node.js incompatibles con V8 Isolates.

## 2. SELECT — leer filas

```typescript
import postgres from "postgres";

const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });

// Template literals → parámetros $1, $2 automáticamente (sin SQL injection)
const products = await sql<Product[]>`
  SELECT id, name, price, stock
  FROM products
  WHERE active = true
  ORDER BY name
`;
return c.json(products);
```

## 3. INSERT — crear registro

```typescript
const schema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0),
});

app.post("/products", zValidator("json", schema), async (c) => {
  const { name, price, stock } = c.req.valid("json");
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const rows = await sql<{ id: number }[]>`
      INSERT INTO products (name, price, stock)
      VALUES (${name}, ${price}, ${stock})
      RETURNING id
    `;
    return c.json({ id: rows[0].id }, 201);
  } finally {
    await sql.end();
  }
});
```

> Los valores interpolados se convierten en parámetros preparados — **sin SQL injection**.

## 4. UPDATE y DELETE

```typescript
// UPDATE — devuelve el conteo de filas afectadas
const result = await sql`
  UPDATE products SET stock = ${newStock}
  WHERE id = ${id}
`;
if (result.count === 0) return c.json({ error: "Not found" }, 404);

// DELETE
await sql`DELETE FROM products WHERE id = ${id}`;
```

## 5. Manejo de errores

```typescript
import { PostgresError } from "postgres";

try {
  const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
  return c.json(rows[0] ?? null);
} catch (err) {
  if (err instanceof PostgresError) {
    // Loguear internamente — nunca exponer detalles de DB al cliente
    console.error("DB error:", err.code, err.message);
    return c.json({ error: "Database error" }, 500);
  }
  throw err;
} finally {
  await sql.end();
}
```

## ✅ Checklist

- [ ] ¿Por qué se usan template literals en lugar de concatenar strings en las queries?
- [ ] ¿Qué devuelve `` sql`INSERT ... RETURNING id` `` como valor TypeScript?
- [ ] ¿Cómo sabes si un UPDATE no encontró el registro?
- [ ] ¿Qué información del error de PostgreSQL NO debes exponer en la respuesta HTTP?

## Referencias

- [postgres.js · Cloudflare Workers](https://github.com/porsager/postgres?tab=readme-ov-file#cloudflare-workers)
- [Hyperdrive · Connect to Postgres](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/)
