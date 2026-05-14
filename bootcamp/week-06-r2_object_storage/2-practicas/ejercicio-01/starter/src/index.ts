import { Hono } from "hono";

// ============================================
// TIPOS Y BINDINGS
// ============================================

type Env = {
  BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 1: Subir un archivo
// ============================================
// Ruta: PUT /files/:key
// Header requerido: Content-Type
app.put("/files/:key", async (c) => {
  const key  = c.req.param("key");
  const body = await c.req.arrayBuffer();
  const ct   = c.req.header("content-type") ?? "application/octet-stream";

  // TODO: Sube el objeto a R2 con:
  //   BUCKET.put(key, body, { httpMetadata: { contentType: ct } })
  // TODO: Devuelve c.json({ key }, 201)
});

// ============================================
// PASO 2: Descargar un archivo
// ============================================
// Ruta: GET /files/:key
app.get("/files/:key", async (c) => {
  const key    = c.req.param("key");

  // TODO: Obtén el objeto con BUCKET.get(key)
  // TODO: Si null → return c.notFound()
  // TODO: Crea headers = new Headers()
  //   y llama a object.writeHttpMetadata(headers)
  //   y headers.set("etag", object.httpEtag)
  // TODO: Devuelve new Response(object.body, { headers })
});

// ============================================
// PASO 3: Listar archivos
// ============================================
// Ruta: GET /files?prefix=photos/&cursor=TOKEN
app.get("/files", async (c) => {
  const cursor = c.req.query("cursor");
  const prefix = c.req.query("prefix");

  // TODO: Llama a BUCKET.list({ prefix, cursor, limit: 20 })
  // Hint: los resultados viven en listed.objects[]
  //   Cada objeto tiene: .key, .size, .uploaded (Date), .customMetadata
  // TODO: Devuelve c.json({
  //   objects:   listed.objects.map(o => ({ key: o.key, size: o.size, uploaded: o.uploaded })),
  //   truncated: listed.truncated,
  //   cursor:    listed.truncated ? listed.cursor : undefined,
  // })
});

// ============================================
// PASO 4: Eliminar un archivo
// ============================================
// Ruta: DELETE /files/:key
app.delete("/files/:key", async (c) => {
  const key = c.req.param("key");

  // TODO: Verifica existencia con BUCKET.head(key)
  // TODO: Si null → return c.notFound()
  // TODO: BUCKET.delete(key)
  // TODO: return c.body(null, 204)
});

export default app;
