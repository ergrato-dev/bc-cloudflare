import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export interface Env {
  WEBHOOK_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>();

// Middleware de error handling
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error("[ERROR]", err);
  return c.json({ error: "Error interno del servidor" }, 500);
});

// ============================================
// PASO 2: Generación de tokens aleatorios
// ============================================

app.get("/token", (c) => {
  const token = randomBytes(32).toString("hex");
  return c.json({ token, bytes: 32, generated_at: new Date().toISOString() });
});

app.get("/token/:bytes", (c) => {
  const rawBytes = c.req.param("bytes");

  if (!/^\d+$/.test(rawBytes)) {
    throw new HTTPException(400, { message: "El parámetro 'bytes' debe ser un número entero" });
  }

  const bytes = Number(rawBytes);
  if (bytes < 8 || bytes > 64) {
    throw new HTTPException(400, { message: "El tamaño debe estar entre 8 y 64 bytes" });
  }

  const token = randomBytes(bytes).toString("hex");
  return c.json({ token, bytes, generated_at: new Date().toISOString() });
});

// ============================================
// PASO 3: Hash SHA-256
// ============================================

app.post("/hash", async (c) => {
  const body = await c.req.json<{ text?: string }>();

  if (!body.text || typeof body.text !== "string") {
    throw new HTTPException(400, { message: "El campo 'text' es requerido" });
  }

  const hash = createHash("sha256").update(body.text).digest("hex");
  return c.json({ input: body.text, hash, algorithm: "sha256" });
});

// ============================================
// PASO 4: Firma HMAC-SHA256
// ============================================

app.post("/sign", async (c) => {
  const body = await c.req.json<{ payload?: string }>();

  if (!body.payload || typeof body.payload !== "string") {
    throw new HTTPException(400, { message: "El campo 'payload' es requerido" });
  }

  const signature = createHmac("sha256", c.env.WEBHOOK_SECRET)
    .update(body.payload)
    .digest("hex");

  return c.json({ payload: body.payload, signature, algorithm: "hmac-sha256" });
});

// ============================================
// PASO 5: Verificación HMAC
// ============================================

app.post("/verify", async (c) => {
  const body = await c.req.json<{ payload?: string; signature?: string }>();

  if (!body.payload || !body.signature) {
    throw new HTTPException(400, { message: "Los campos 'payload' y 'signature' son requeridos" });
  }

  const expected = createHmac("sha256", c.env.WEBHOOK_SECRET)
    .update(body.payload)
    .digest("hex");

  // timingSafeEqual requiere buffers del mismo tamaño
  if (expected.length !== body.signature.length) {
    return c.json({ valid: false });
  }

  const isValid = timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(body.signature, "hex")
  );

  return c.json({ valid: isValid });
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    runtime: "nodejs_compat_v2",
    endpoints: ["/token", "/token/:bytes", "/hash", "/sign", "/verify"],
  });
});

app.notFound((c) => {
  return c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404);
});

export default app;
