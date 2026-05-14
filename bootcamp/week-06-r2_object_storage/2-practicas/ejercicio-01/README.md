# Ejercicio 01 — API de archivos con R2 (put / get / delete / list)

Construirás una **API REST de gestión de archivos** que usa R2 como backend
de almacenamiento. Cada ruta mapea directamente a una operación del binding.

**Tiempo estimado**: 45–60 min

---

## Contexto

El binding `R2Bucket` expone cuatro operaciones fundamentales: `put`, `get`,
`delete` y `list`. Tu misión es conectar cada ruta de Hono a la operación
correspondiente, devolviendo los headers HTTP correctos.

---

### Preparación

```bash
cd starter
pnpm install
wrangler dev
```

> No necesitas un bucket remoto para el ejercicio — Wrangler usa un
> directorio local `.wrangler/state/r2/` como emulación de R2.

---

### Paso 1: Subir un archivo — `PUT /files/:key`

```typescript
// Lee el body como ArrayBuffer y guarda el objeto en R2
app.put("/files/:key", async (c) => {
  const key  = c.req.param("key");
  const body = await c.req.arrayBuffer();
  const ct   = c.req.header("content-type") ?? "application/octet-stream";

  // Hint: BUCKET.put(key, body, { httpMetadata: { contentType: ct } })
  await c.env.BUCKET.put(key, body, { httpMetadata: { contentType: ct } });

  return c.json({ key }, 201);
});
```

**Abre `starter/src/index.ts`** y completa el TODO del Paso 1.

---

### Paso 2: Descargar un archivo — `GET /files/:key`

```typescript
// Obtiene el objeto y devuelve su body con los headers correctos
app.get("/files/:key", async (c) => {
  const key    = c.req.param("key");
  const object = await c.env.BUCKET.get(key);

  // Hint: si object === null → return c.notFound()
  // Hint: object.writeHttpMetadata(headers) copia Content-Type, ETag, etc.
  // Hint: devuelve new Response(object.body, { headers })
});
```

**Completa el TODO del Paso 2.**

---

### Paso 3: Listar archivos — `GET /files`

```typescript
// Lista todos los objetos del bucket con soporte de cursor para paginación
app.get("/files", async (c) => {
  const cursor = c.req.query("cursor");
  const prefix = c.req.query("prefix");

  // Hint: BUCKET.list({ prefix, cursor, limit: 20 })
  // Hint: devuelve { objects: [...], truncated, cursor? }
  // Los objetos deben incluir: key, size, uploaded (fecha)
});
```

**Completa el TODO del Paso 3.**

---

### Paso 4: Eliminar un archivo — `DELETE /files/:key`

```typescript
app.delete("/files/:key", async (c) => {
  const key = c.req.param("key");

  // Hint: verifica que el objeto exista con BUCKET.head(key)
  // Si no existe → return c.notFound()
  // Si existe → BUCKET.delete(key) → return c.body(null, 204)
});
```

**Completa el TODO del Paso 4.**

---

### Prueba manual con curl

```bash
# Subir un archivo de texto
curl -X PUT http://localhost:8787/files/hello.txt \
  -H "Content-Type: text/plain" \
  --data "Hola desde R2"

# Descargar
curl http://localhost:8787/files/hello.txt

# Listar
curl http://localhost:8787/files

# Eliminar
curl -X DELETE http://localhost:8787/files/hello.txt
```
