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

app.put("/files/:key", async (c) => {
  const key  = c.req.param("key");
  const body = await c.req.arrayBuffer();
  const ct   = c.req.header("content-type") ?? "application/octet-stream";

  await c.env.BUCKET.put(key, body, {
    httpMetadata: { contentType: ct },
  });

  return c.json({ key }, 201);
});

// ============================================
// PASO 2: Descargar un archivo
// ============================================

app.get("/files/:key", async (c) => {
  const key    = c.req.param("key");
  const object = await c.env.BUCKET.get(key);

  if (!object) return c.notFound();

  // Copia Content-Type, ETag y demás headers HTTP del objeto
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
});

// ============================================
// PASO 3: Listar archivos con paginación
// ============================================

app.get("/files", async (c) => {
  const cursor = c.req.query("cursor");
  const prefix = c.req.query("prefix");

  const listed = await c.env.BUCKET.list({
    prefix,
    cursor,
    limit: 20,
  });

  return c.json({
    objects:   listed.objects.map((o) => ({
      key:      o.key,
      size:     o.size,
      uploaded: o.uploaded,
    })),
    truncated: listed.truncated,
    cursor:    listed.truncated ? listed.cursor : undefined,
  });
});

// ============================================
// PASO 4: Eliminar un archivo
// ============================================

app.delete("/files/:key", async (c) => {
  const key  = c.req.param("key");
  const head = await c.env.BUCKET.head(key);

  if (!head) return c.notFound();

  await c.env.BUCKET.delete(key);
  return c.body(null, 204);
});

export default app;
