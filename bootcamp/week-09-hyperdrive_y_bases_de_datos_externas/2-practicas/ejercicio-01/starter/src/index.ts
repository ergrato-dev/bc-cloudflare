import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import postgres from "postgres";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con el binding HYPERDRIVE
// Hint: el tipo de un Hyperdrive binding es `Hyperdrive`
type Bindings = {
  // TODO: añadir HYPERDRIVE: Hyperdrive
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
  // TODO: Instancia el cliente postgres con c.env.HYPERDRIVE.connectionString y { max: 5 }
  // TODO: Consulta: SELECT id, name, description, price, stock
  //                 FROM products WHERE active = true ORDER BY name
  // TODO: Cierra el cliente con sql.end() en un bloque finally
  // TODO: Devuelve los productos como JSON
});

// ============================================
// PASO 2: GET /products/:id — obtener un producto
// ============================================

app.get("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);

  // TODO: Instancia el cliente postgres
  // TODO: Consulta: SELECT * FROM products WHERE id = ${id} AND active = true
  // Hint: los valores interpolados en template literals son parámetros preparados
  // TODO: Si rows.length === 0, devuelve 404 con { error: "Not found" }
  // TODO: Si existe, devuelve rows[0] como JSON
  // TODO: Cierra el cliente en un bloque finally
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

  // TODO: Instancia el cliente postgres
  // TODO: INSERT INTO products (name, description, price, stock)
  //       VALUES (${name}, ${description ?? null}, ${price}, ${stock})
  //       RETURNING id
  // TODO: Devuelve { id: rows[0].id } con status 201
  // TODO: Cierra el cliente en un bloque finally
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

  // TODO: Instancia el cliente postgres
  // TODO: UPDATE products SET stock = ${stock} WHERE id = ${id} AND active = true
  // TODO: Si result.count === 0, devuelve 404 con { error: "Not found" }
  // TODO: Devuelve { updated: true } con status 200
  // TODO: Cierra el cliente en un bloque finally
});

// ============================================
// PASO 5: DELETE /products/:id — soft delete
// ============================================

app.delete("/products/:id", async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "ID inválido" }, 400);

  // TODO: Instancia el cliente postgres
  // TODO: UPDATE products SET active = false WHERE id = ${id} AND active = true
  //       (soft delete — desactiva el producto sin borrar la fila)
  // TODO: Si result.count === 0, devuelve 404 con { error: "Not found" }
  // TODO: Devuelve { deleted: true } con status 200
  // TODO: Cierra el cliente en un bloque finally
});

export default app;
