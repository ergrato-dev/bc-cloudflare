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
// HELPER
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
// GET /catalog — query cacheable
// ============================================

app.get("/catalog", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const { result: products, ms } = await measureQuery(() =>
      sql<Product[]>`
        SELECT id, name, price, stock
        FROM products
        WHERE active = true
        ORDER BY name
      `
    );
    c.header("X-Query-Ms", String(ms));
    return c.json({ products, queryMs: ms });
  } finally {
    await sql.end();
  }
});

// ============================================
// GET /catalog/live — SELECT en transacción (no cacheable)
// ============================================

app.get("/catalog/live", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const { result: products, ms } = await measureQuery(() =>
      sql.begin((tx) =>
        tx<Product[]>`
          SELECT id, name, price, stock
          FROM products
          WHERE active = true
          ORDER BY name
        `
      )
    );
    c.header("X-Query-Ms", String(ms));
    return c.json({ products, queryMs: ms });
  } finally {
    await sql.end();
  }
});

// ============================================
// GET /catalog/random — ORDER BY RANDOM() (no cacheable)
// ============================================

app.get("/catalog/random", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const { result: products, ms } = await measureQuery(() =>
      sql<Product[]>`
        SELECT id, name, price, stock
        FROM products
        WHERE active = true
        ORDER BY RANDOM()
        LIMIT 5
      `
    );
    c.header("X-Query-Ms", String(ms));
    return c.json({ products, queryMs: ms });
  } finally {
    await sql.end();
  }
});

// ============================================
// GET /catalog/stats — NOW() en SELECT (no cacheable)
// ============================================

app.get("/catalog/stats", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  try {
    const { result: rows, ms } = await measureQuery(() =>
      sql<Stats[]>`
        SELECT
          COUNT(*)::text          AS total,
          AVG(price)::text        AS avg_price,
          NOW()::text             AS now
        FROM products
        WHERE active = true
      `
    );
    c.header("X-Query-Ms", String(ms));
    return c.json({ stats: rows[0], queryMs: ms });
  } finally {
    await sql.end();
  }
});

export default app;
