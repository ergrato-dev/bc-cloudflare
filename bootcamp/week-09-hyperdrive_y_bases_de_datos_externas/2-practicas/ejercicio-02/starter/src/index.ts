import { Hono } from "hono";
import postgres from "postgres";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  HYPERDRIVE: Hyperdrive;
};

type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
};

type Stats = {
  total: string;
  avg_price: string;
  now: string;
};

// ============================================
// HELPER — ya implementado, no modificar
// ============================================

async function measureQuery<T>(
  fn: () => Promise<T>
): Promise<{ result: T; ms: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// ============================================
// PASO 3: GET /catalog — query cacheable
// Hyperdrive puede cachear este SELECT porque:
// - no está en transacción
// - no usa funciones no deterministas (NOW, RANDOM)
// ============================================

app.get("/catalog", async (c) => {
  // TODO: Instancia el cliente postgres con c.env.HYPERDRIVE.connectionString y { max: 5 }
  // TODO: Usa measureQuery para medir:
  //       SELECT id, name, price, stock FROM products WHERE active = true ORDER BY name
  // TODO: Setea el header "X-Query-Ms" con el valor de ms (como string)
  // TODO: Devuelve { products, queryMs: ms } como JSON
  // TODO: Cierra el cliente en un bloque finally
});

// ============================================
// PASO 4: GET /catalog/live — SELECT en transacción (no cacheable)
// Las transacciones desactivan el caching de Hyperdrive
// ============================================

app.get("/catalog/live", async (c) => {
  // TODO: Instancia el cliente postgres
  // TODO: Usa measureQuery para medir sql.begin():
  //   sql.begin((tx) =>
  //     tx<Product[]>`SELECT id, name, price, stock FROM products WHERE active = true ORDER BY name`
  //   )
  // TODO: Setea X-Query-Ms y devuelve { products, queryMs: ms }
  // TODO: Cierra el cliente en un bloque finally
});

// ============================================
// PASO 5: GET /catalog/random — ORDER BY RANDOM() (no cacheable)
// Hyperdrive detecta funciones no deterministas y no cachea
// ============================================

app.get("/catalog/random", async (c) => {
  // TODO: Instancia el cliente postgres
  // TODO: SELECT id, name, price, stock FROM products WHERE active = true ORDER BY RANDOM() LIMIT 5
  // Hint: RANDOM() hace la query no determinista → no se puede cachear
  // TODO: Setea X-Query-Ms y devuelve { products, queryMs: ms }
  // TODO: Cierra el cliente en un bloque finally
});

// ============================================
// PASO 5: GET /catalog/stats — NOW() en SELECT (no cacheable)
// ============================================

app.get("/catalog/stats", async (c) => {
  // TODO: Instancia el cliente postgres
  // TODO: SELECT COUNT(*) AS total, AVG(price) AS avg_price, NOW() AS now
  //       FROM products WHERE active = true
  // Hint: NOW() es no determinista → Hyperdrive no cachea esta query
  // TODO: Setea X-Query-Ms y devuelve { stats: rows[0], queryMs: ms }
  // TODO: Cierra el cliente en un bloque finally
});

export default app;
