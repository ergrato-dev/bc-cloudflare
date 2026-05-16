import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import postgres, { PostgresError } from "postgres";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  HYPERDRIVE: Hyperdrive;
};

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  active: boolean;
  created_at: string;
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// PASO 1: GET /products — listar productos activos
// ============================================

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

// ============================================
// PASO 2: GET /products/:id — obtener un producto
// ============================================

app.get("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);

  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const rows = await sql<Product[]>`
      SELECT * FROM products WHERE id = ${id} AND active = true
    `;
    if (rows.length === 0) return c.json({ error: "Not found" }, 404);
    return c.json(rows[0]);
  } finally {
    await sql.end();
  }
});

// ============================================
// PASO 3: POST /products — crear producto
// ============================================

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
});

app.post("/products", zValidator("json", createSchema), async (c) => {
  const { name, description, price, stock } = c.req.valid("json");
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const rows = await sql<{ id: number }[]>`
      INSERT INTO products (name, description, price, stock)
      VALUES (${name}, ${description ?? null}, ${price}, ${stock})
      RETURNING id
    `;
    return c.json({ id: rows[0].id }, 201);
  } catch (err) {
    if (err instanceof PostgresError) {
      console.error("DB insert error:", err.code, err.message);
      return c.json({ error: "Database error" }, 500);
    }
    throw err;
  } finally {
    await sql.end();
  }
});

// ============================================
// PASO 4: PATCH /products/:id/stock — actualizar stock
// ============================================

const stockSchema = z.object({
  stock: z.number().int().min(0),
});

app.patch("/products/:id/stock", zValidator("json", stockSchema), async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);
  const { stock } = c.req.valid("json");

  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const result = await sql`
      UPDATE products SET stock = ${stock} WHERE id = ${id} AND active = true
    `;
    if (result.count === 0) return c.json({ error: "Not found" }, 404);
    return c.json({ updated: true });
  } finally {
    await sql.end();
  }
});

// ============================================
// PASO 5: DELETE /products/:id — soft delete
// ============================================

app.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);

  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const result = await sql`
      UPDATE products SET active = false WHERE id = ${id} AND active = true
    `;
    if (result.count === 0) return c.json({ error: "Not found" }, 404);
    return c.json({ deleted: true });
  } finally {
    await sql.end();
  }
});

export default app;
