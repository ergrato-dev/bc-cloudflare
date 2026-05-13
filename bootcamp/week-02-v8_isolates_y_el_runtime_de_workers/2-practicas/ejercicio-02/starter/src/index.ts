// ============================================
// PASO 1: Importar módulos Node.js
// ============================================
// Estos imports funcionan gracias a "nodejs_compat_v2" en wrangler.jsonc
// TODO: Descomenta las importaciones que necesites en cada paso
// import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

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

// TODO: Implementa GET /token que devuelva un token de 32 bytes en hex
// { token: string, bytes: 32, generated_at: new Date().toISOString() }
// Hint: usa randomBytes(32).toString("hex")

// TODO: Implementa GET /token/:bytes que devuelva un token del tamaño solicitado
// Hint: valida que bytes esté entre 8 y 64 con HTTPException(400, ...)
// Hint: usa Number(c.req.param("bytes"))

// ============================================
// PASO 3: Hash SHA-256
// ============================================

// TODO: Implementa POST /hash que acepta { text: string }
// Devuelve { input: string, hash: string, algorithm: "sha256" }
// Hint: usa createHash("sha256").update(text).digest("hex")
// Hint: valida que el body tenga "text" — throw HTTPException(400) si falta

// ============================================
// PASO 4: Firma HMAC-SHA256
// ============================================

// TODO: Implementa POST /sign que acepta { payload: string }
// Devuelve { payload: string, signature: string, algorithm: "hmac-sha256" }
// Hint: usa createHmac("sha256", c.env.WEBHOOK_SECRET).update(payload).digest("hex")
// Hint: valida que payload no esté vacío

// ============================================
// PASO 5: Verificación HMAC
// ============================================

// TODO: Implementa POST /verify que acepta { payload: string, signature: string }
// Devuelve { valid: boolean }
// Hint: recalcula la firma con HMAC y usa timingSafeEqual para comparar
// Hint: timingSafeEqual requiere que ambos buffers tengan la misma longitud
//   — si no, devuelve { valid: false } sin lanzar error

// GET /health
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
