# Ejercicio 01 — API CRUD de Productos con Hyperdrive

## Objetivo

Implementar una API REST completa que lee y escribe en una tabla `products` de
PostgreSQL externo usando Hyperdrive como proxy de conexión y `postgres.js`
como driver.

---

## Configuración previa

### 1. Base de datos PostgreSQL

Necesitas una base de datos PostgreSQL accesible desde internet. Opciones:

- **Neon** (recomendado): [neon.tech](https://neon.tech) — free tier disponible
- **Supabase**: [supabase.com](https://supabase.com) — free tier disponible
- **Local con Docker**: `docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`

Ejecuta el schema y el seed en tu base de datos:

```bash
psql "postgresql://user:pass@host/dbname" -f starter/schema.sql
psql "postgresql://user:pass@host/dbname" -f starter/seed.sql
```

### 2. Crear el Hyperdrive config

```bash
cd starter
wrangler hyperdrive create products-db \
  --connection-string="postgresql://user:pass@host:5432/dbname"
```

Copia el **ID** devuelto y actualiza `wrangler.jsonc`:

```jsonc
"id": "PEGA_AQUI_TU_HYPERDRIVE_ID"
```

---

## Paso 1: Tipo Bindings con HYPERDRIVE

El binding expone `connectionString` — el driver recibe esta URL y habla con
el proxy de Hyperdrive (no directamente con el DB).

```typescript
type Bindings = {
  HYPERDRIVE: Hyperdrive;
};
```

**Abre `starter/src/index.ts`** y define el tipo `Bindings`.

---

## Paso 2: GET /products — listar productos activos

```typescript
app.get("/products", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const products = await sql<Product[]>`
      SELECT id, name, description, price, stock
      FROM products
      WHERE active = true
      ORDER BY name
    `;
    return c.json(products);
  } finally {
    await sql.end();
  }
});
```

**Abre `starter/src/index.ts`** y completa el TODO del GET /products.

---

## Paso 3: GET /products/:id — obtener un producto

Los template literals de `postgres.js` convierten automáticamente los valores
interpolados en parámetros preparados — no hay riesgo de SQL injection.

```typescript
const rows = await sql<Product[]>`
  SELECT * FROM products WHERE id = ${id} AND active = true
`;
```

**Completa el TODO del GET /products/:id.**

---

## Paso 4: POST /products — crear con Zod

```typescript
const createSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().min(0),
});
```

**Completa el TODO del POST /products.**

---

## Paso 5: PATCH y DELETE — actualizar y soft delete

El DELETE no borra la fila — setea `active = false`. Esto preserva el historial
y evita problemas de integridad referencial.

```typescript
const result = await sql`
  UPDATE products SET active = false WHERE id = ${id} AND active = true
`;
if (result.count === 0) return c.json({ error: "Not found" }, 404);
```

**Completa los TODOs de PATCH /products/:id/stock y DELETE /products/:id.**

---

## Paso 6: Probar con Wrangler

```bash
cd starter
pnpm install
pnpm dev

# Listar productos (necesita localConnectionString configurado)
curl http://localhost:8787/products

# Crear producto
curl -X POST http://localhost:8787/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Headset Pro","price":129.99,"stock":10}'

# Actualizar stock
curl -X PATCH http://localhost:8787/products/1/stock \
  -H "Content-Type: application/json" \
  -d '{"stock":5}'

# Soft delete
curl -X DELETE http://localhost:8787/products/1
```

---

## Criterios de éxito

- [ ] `GET /products` devuelve los 25 productos del seed
- [ ] `GET /products/:id` devuelve 404 para IDs inexistentes
- [ ] `POST /products` valida con Zod y devuelve `{ id }` con status 201
- [ ] `DELETE /products/:id` desactiva sin borrar la fila (soft delete)
