import { Hono } from "hono";

// ============================================
// TIPOS Y BINDINGS
// ============================================

type Env = {
  BUCKET: R2Bucket;
  TOKENS: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 1: Subir un archivo con customMetadata
// ============================================
// Ruta: PUT /files/:key
// Headers: Content-Type, X-Filename (opcional)
app.put("/files/:key", async (c) => {
  const key      = c.req.param("key");
  const body     = await c.req.arrayBuffer();
  const ct       = c.req.header("content-type") ?? "application/octet-stream";
  const filename = c.req.header("x-filename") ?? key;

  // TODO: Sube el objeto con:
  //   httpMetadata: { contentType: ct, contentDisposition: `attachment; filename="${filename}"` }
  //   customMetadata: { filename, uploadedAt: new Date().toISOString() }
  // TODO: Devuelve c.json({ key }, 201)
});

// ============================================
// PASO 2: Generar token de descarga temporal
// ============================================
// Ruta: POST /files/:key/token?ttl=3600
app.post("/files/:key/token", async (c) => {
  const key = c.req.param("key");
  const ttl = Math.min(86400, Number(c.req.query("ttl") ?? "3600"));

  // TODO: Verifica existencia con BUCKET.head(key)
  // TODO: Si null → return c.notFound()
  // TODO: const token = crypto.randomUUID()
  // TODO: await TOKENS.put(`token:${token}`, key, { expirationTtl: ttl })
  // TODO: return c.json({ token, url: `/download/${token}`, expiresIn: ttl })
});

// ============================================
// PASO 3: Descargar archivo con token
// ============================================
// Ruta: GET /download/:token
app.get("/download/:token", async (c) => {
  const token = c.req.param("token");

  // TODO: const key = await TOKENS.get(`token:${token}`)
  // TODO: Si null → return c.json({ error: "Token inválido o expirado" }, 403)
  // TODO: const object = await BUCKET.get(key)
  // TODO: Si null → return c.notFound()
  // TODO: Crea headers, llama object.writeHttpMetadata(headers)
  //   y headers.set("etag", object.httpEtag)
  // TODO: return new Response(object.body, { headers })
});

// ============================================
// PASO 4: Listar archivos con metadata
// ============================================
// Ruta: GET /files
app.get("/files", async (c) => {
  // TODO: BUCKET.list({ include: ["customMetadata", "httpMetadata"], limit: 20 })
  // TODO: Devuelve c.json({
  //   objects: listed.objects.map(o => ({
  //     key:        o.key,
  //     size:       o.size,
  //     filename:   o.customMetadata?.filename,
  //     uploadedAt: o.customMetadata?.uploadedAt,
  //   })),
  //   truncated: listed.truncated,
  // })
});

export default app;
