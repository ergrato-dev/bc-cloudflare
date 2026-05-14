# Ejercicio 02 — Tokens de Descarga Temporales (R2 + KV)

Implementarás un sistema de **acceso controlado a archivos** privados en R2
usando tokens temporales almacenados en Workers KV.

**Tiempo estimado**: 45–60 min

---

## Contexto

R2 no expone URLs públicas firmadas de forma nativa desde el binding de
Workers. El patrón estándar es: el Worker genera un token aleatorio, lo
guarda en KV con TTL y lo valida al momento de la descarga.

---

### Preparación

```bash
cd starter
pnpm install
wrangler dev
```

---

### Paso 1: Subir un archivo privado — `PUT /files/:key`

Esta ruta es igual al ejercicio anterior pero agrega `customMetadata`.

```typescript
// Guarda el objeto con metadata del uploader
app.put("/files/:key", async (c) => {
  const key      = c.req.param("key");
  const body     = await c.req.arrayBuffer();
  const ct       = c.req.header("content-type") ?? "application/octet-stream";
  const filename = c.req.header("x-filename") ?? key;

  // Hint: incluye customMetadata: { filename, uploadedAt: new Date().toISOString() }
  await c.env.BUCKET.put(key, body, {
    httpMetadata:   { contentType: ct, contentDisposition: `attachment; filename="${filename}"` },
    customMetadata: { filename, uploadedAt: new Date().toISOString() },
  });

  return c.json({ key }, 201);
});
```

**Completa el TODO del Paso 1** con la lógica de metadata.

---

### Paso 2: Generar un token de descarga — `POST /files/:key/token`

```typescript
// POST /files/:key/token?ttl=3600
app.post("/files/:key/token", async (c) => {
  const key = c.req.param("key");
  const ttl = Math.min(86400, Number(c.req.query("ttl") ?? "3600"));

  // Hint 1: verifica que el objeto existe con BUCKET.head(key)
  //   Si no existe → return c.notFound()
  // Hint 2: genera token con crypto.randomUUID()
  // Hint 3: guarda en KV: TOKENS.put(`token:${token}`, key, { expirationTtl: ttl })
  // Hint 4: devuelve { token, url: `/download/${token}`, expiresIn: ttl }
});
```

**Completa el TODO del Paso 2.**

---

### Paso 3: Descargar con token — `GET /download/:token`

```typescript
app.get("/download/:token", async (c) => {
  const token = c.req.param("token");

  // Hint 1: consulta el token en KV: key = await TOKENS.get(`token:${token}`)
  // Hint 2: si null → return c.json({ error: "Token inválido o expirado" }, 403)
  // Hint 3: descarga el objeto con BUCKET.get(key)
  // Hint 4: si null → return c.notFound()
  // Hint 5: copia httpMetadata y devuelve new Response(object.body, { headers })
});
```

**Completa el TODO del Paso 3.**

---

### Paso 4: Listar archivos con metadata — `GET /files`

```typescript
app.get("/files", async (c) => {
  // Hint: BUCKET.list({ include: ["customMetadata", "httpMetadata"], limit: 20 })
  // Devuelve key, size, customMetadata.filename, customMetadata.uploadedAt
});
```

**Completa el TODO del Paso 4.**

---

### Prueba del flujo completo

```bash
# 1. Subir un archivo
curl -X PUT http://localhost:8787/files/report.pdf \
  -H "Content-Type: application/pdf" \
  -H "X-Filename: quarterly-report.pdf" \
  --data-binary @report.pdf

# 2. Generar token (expira en 60 segundos)
curl -X POST "http://localhost:8787/files/report.pdf/token?ttl=60"
# → { "token": "uuid-...", "url": "/download/uuid-...", "expiresIn": 60 }

# 3. Descargar con el token
curl "http://localhost:8787/download/uuid-..." -o downloaded.pdf

# 4. Intentar de nuevo pasados 60s → 403
```
