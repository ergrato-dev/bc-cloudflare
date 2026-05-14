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

app.put("/files/:key", async (c) => {
  const key      = c.req.param("key");
  const body     = await c.req.arrayBuffer();
  const ct       = c.req.header("content-type") ?? "application/octet-stream";
  const filename = c.req.header("x-filename") ?? key;

  await c.env.BUCKET.put(key, body, {
    httpMetadata: {
      contentType:        ct,
      contentDisposition: `attachment; filename="${filename}"`,
    },
    customMetadata: {
      filename,
      uploadedAt: new Date().toISOString(),
    },
  });

  return c.json({ key }, 201);
});

// ============================================
// PASO 2: Generar token de descarga temporal
// ============================================

app.post("/files/:key/token", async (c) => {
  const key = c.req.param("key");
  const ttl = Math.min(86400, Number(c.req.query("ttl") ?? "3600"));

  // Verifica que el objeto existe antes de emitir el token
  const head = await c.env.BUCKET.head(key);
  if (!head) return c.notFound();

  const token = crypto.randomUUID();
  await c.env.TOKENS.put(`token:${token}`, key, { expirationTtl: ttl });

  return c.json({ token, url: `/download/${token}`, expiresIn: ttl });
});

// ============================================
// PASO 3: Descargar archivo con token
// ============================================

app.get("/download/:token", async (c) => {
  const token = c.req.param("token");

  // Valida el token en KV — null si no existe o ya expiró
  const key = await c.env.TOKENS.get(`token:${token}`);
  if (!key) {
    return c.json({ error: "Token inválido o expirado" }, 403);
  }

  const object = await c.env.BUCKET.get(key);
  if (!object) return c.notFound();

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
});

// ============================================
// PASO 4: Listar archivos con metadata
// ============================================

app.get("/files", async (c) => {
  const listed = await c.env.BUCKET.list({
    include: ["customMetadata", "httpMetadata"],
    limit:   20,
  });

  return c.json({
    objects: listed.objects.map((o) => ({
      key:        o.key,
      size:       o.size,
      filename:   o.customMetadata?.filename,
      uploadedAt: o.customMetadata?.uploadedAt,
    })),
    truncated: listed.truncated,
  });
});

export default app;
