import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// ============================================
// PROYECTO SEMANAL: Biblioteca de Archivos con R2
// Semana 06 — R2 Object Storage
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Los nombres de rutas y campos de customMetadata deben reflejar
// los recursos específicos de tu dominio.
//
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → /animals/:id/records (historiales PDF)
//   Marina deportiva    → /boats/:id/documents (certificados técnicos)
//   Biblioteca          → /books/:id/cover (portadas, EPUBs)
//   Escape room         → /rooms/:id/media (fotos, videos)

// ============================================
// TIPOS Y BINDINGS
// ============================================

type Env = {
  BUCKET: R2Bucket;
  TOKENS: KVNamespace;
};

// TODO: Define el schema de validación para los query params de token
// Hint: z.object({ ttl: z.coerce.number().min(60).max(86400).optional() })
const tokenQuerySchema = z.object({
  ttl: z.coerce.number().min(60).max(86400).optional(),
});

const app = new Hono<{ Bindings: Env }>();

// ============================================
// RUTA 1: Subir un archivo con metadata del dominio
// ============================================
// PUT /files/:key
// Headers: Content-Type, X-Filename (opcional)
// TODO: Adapta customMetadata con al menos 3 campos de tu dominio
//   Ejemplos: { category, entityId, uploadedBy, description }
app.put("/files/:key", async (c) => {
  const key      = c.req.param("key");
  const body     = await c.req.arrayBuffer();
  const ct       = c.req.header("content-type") ?? "application/octet-stream";
  const filename = c.req.header("x-filename") ?? key;

  // TODO: Extrae headers adicionales del dominio (x-category, x-entity-id, etc.)
  // TODO: BUCKET.put(key, body, { httpMetadata, customMetadata })
  //   customMetadata debe incluir mínimo 3 campos del dominio
  // TODO: return c.json({ key, filename }, 201)
});

// ============================================
// RUTA 2: Listar archivos con paginación
// ============================================
// GET /files?prefix=PREFIJO&cursor=CURSOR
// TODO: Devuelve objetos con customMetadata incluida
// TODO: Implementa paginación con cursor
app.get("/files", async (c) => {
  const cursor = c.req.query("cursor");
  const prefix = c.req.query("prefix");

  // TODO: BUCKET.list({ prefix, cursor, limit: 20, include: ["customMetadata"] })
  // TODO: return c.json({ objects: [...], truncated, cursor? })
});

// ============================================
// RUTA 3: Descargar un archivo directamente
// ============================================
// GET /files/:key
// TODO: Devuelve el archivo con Content-Type y Content-Disposition correctos
app.get("/files/:key", async (c) => {
  const key = c.req.param("key");

  // TODO: BUCKET.get(key) → si null, notFound()
  // TODO: writeHttpMetadata(headers), set etag
  // TODO: return new Response(object.body, { headers })
});

// ============================================
// RUTA 4: Eliminar un archivo
// ============================================
// DELETE /files/:key
app.delete("/files/:key", async (c) => {
  const key = c.req.param("key");

  // TODO: BUCKET.head(key) → si null, notFound()
  // TODO: BUCKET.delete(key)
  // TODO: return c.body(null, 204)
});

// ============================================
// RUTA 5: Generar token de descarga temporal
// ============================================
// POST /files/:key/token?ttl=3600
app.post("/files/:key/token", zValidator("query", tokenQuerySchema), async (c) => {
  const key = c.req.param("key");
  const ttl = c.req.valid("query").ttl ?? 3600;

  // TODO: BUCKET.head(key) → si null, notFound()
  // TODO: token = crypto.randomUUID()
  // TODO: TOKENS.put(`token:${token}`, key, { expirationTtl: ttl })
  // TODO: return c.json({ token, url: `/download/${token}`, expiresIn: ttl })
});

// ============================================
// RUTA 6: Descargar con token temporal
// ============================================
// GET /download/:token
app.get("/download/:token", async (c) => {
  const token = c.req.param("token");

  // TODO: key = await TOKENS.get(`token:${token}`)
  // TODO: Si null → return c.json({ error: "Token inválido o expirado" }, 403)
  // TODO: BUCKET.get(key) → si null, notFound()
  // TODO: writeHttpMetadata + return new Response(object.body, { headers })
});

export default app;
