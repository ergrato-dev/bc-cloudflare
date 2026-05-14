# R2 — Object Storage sin Egress

> ![Arquitectura R2](../0-assets/01-r2-architecture.svg)

## Objetivos

- Entender qué es R2 y cómo se diferencia de KV y de S3
- Crear un bucket y declarar el binding en `wrangler.jsonc`
- Subir y descargar objetos desde un Worker con `put` y `get`

## 1. Qué es R2

R2 es el object storage de Cloudflare. Almacena archivos arbitrarios
(imágenes, PDFs, videos, backups) sin cobrar ancho de banda de salida.

| Característica | R2 | Workers KV |
|---------------|-----|------------|
| Tipo de dato | binario / texto (hasta 5 TB/obj) | texto / JSON (hasta 25 MB) |
| Egress | **Gratis** | Gratis |
| Latencia | Mayor (objeto completo) | Menor (~1 ms) |
| Caso de uso | Archivos grandes, media | Config, sesiones, flags |

> La ausencia de egress es el diferencial de R2 frente a S3.

## 2. Binding en wrangler.jsonc

```jsonc
// wrangler.jsonc
{
  "r2_buckets": [
    {
      "binding": "BUCKET",
      "bucket_name": "media-bucket",
      "preview_bucket_name": "media-bucket-dev"
    }
  ]
}
```

Crear el bucket con Wrangler:

```bash
wrangler r2 bucket create media-bucket
```

## 3. Subir objetos — `put`

```typescript
type Env = { BUCKET: R2Bucket };

// Sube el body completo de la request como un objeto R2
app.put("/files/:key", async (c) => {
  const key  = c.req.param("key");
  const body = await c.req.arrayBuffer();

  await c.env.BUCKET.put(key, body, {
    httpMetadata: { contentType: c.req.header("content-type") ?? "application/octet-stream" },
  });

  return c.json({ key }, 201);
});
```

## 4. Descargar objetos — `get`

```typescript
// Devuelve el objeto como Response directa con sus headers
app.get("/files/:key", async (c) => {
  const key    = c.req.param("key");
  const object = await c.env.BUCKET.get(key);

  if (!object) return c.notFound();

  // Copia los headers HTTP del objeto (Content-Type, ETag, etc.)
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
});
```

## 5. Eliminar objetos — `delete`

```typescript
app.delete("/files/:key", async (c) => {
  const key = c.req.param("key");
  await c.env.BUCKET.delete(key);
  return c.body(null, 204);
});
```

## ✅ Checklist

- [ ] ¿Qué ventaja tiene R2 frente a S3 en términos de costos de red?
- [ ] ¿Qué parámetro de `put` define el `Content-Type` del objeto guardado?
- [ ] ¿Qué devuelve `BUCKET.get(key)` si el objeto no existe?
- [ ] ¿Qué hace `object.writeHttpMetadata(headers)` al devolver un objeto?

## Referencias

- [R2 · Workers Binding API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/)
- [R2 · Get started](https://developers.cloudflare.com/r2/get-started/)
