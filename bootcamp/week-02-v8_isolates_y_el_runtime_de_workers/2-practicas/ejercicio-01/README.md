# Ejercicio 01 — Error Handling y Middleware con Hono

Aprenderás a construir una API robusta con manejo de errores global,
middleware de logging y respuestas HTTP semánticamente correctas.

---

## Contexto

Tienes una API de una **biblioteca pública** con un catálogo de libros.
El starter tiene las rutas básicas pero sin ningún manejo de errores:
si algo falla, el cliente recibe un 500 sin explicación.

Tu misión: añadir error handling completo y middleware de logging.

---

### Paso 1: Middleware de logging con timing

Un middleware registra cada request antes de que llegue al handler de ruta.
Usa `app.use("*", ...)` y llama a `next()` para pasar al siguiente handler.

```typescript
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${new URL(c.req.url).pathname} → ${c.res.status} (${ms}ms)`);
});
```

**Abre `starter/src/index.ts`** y completa el TODO del Paso 1.

---

### Paso 2: HTTPException para errores esperados

`HTTPException` de Hono permite lanzar errores con el status HTTP correcto.

```typescript
import { HTTPException } from "hono/http-exception";

// Lanzar 404 cuando un recurso no existe
throw new HTTPException(404, { message: "Libro no encontrado" });

// Lanzar 400 cuando el input es inválido
throw new HTTPException(400, { message: "El campo 'title' es requerido" });
```

**Completa el TODO del Paso 2** — añade validación de parámetros con `HTTPException`.

---

### Paso 3: app.onError — captura de errores global

```typescript
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error("Error inesperado:", err);
  return c.json({ error: "Error interno del servidor" }, 500);
});
```

**Completa el TODO del Paso 3** — registra el handler global de errores.

---

### Paso 4: app.notFound

```typescript
app.notFound((c) => {
  return c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404);
});
```

**Completa el TODO del Paso 4**.

---

### Paso 5: Probar el Worker

```bash
cd starter
pnpm install
wrangler dev
```

Prueba los siguientes casos:

```bash
# Ruta que existe → 200
curl http://localhost:8787/books

# Libro que no existe → 404 con JSON
curl http://localhost:8787/books/99999

# ID inválido → 400 con JSON
curl http://localhost:8787/books/abc

# Ruta que no existe → 404 con JSON
curl http://localhost:8787/unknown-route
```

Verifica en la terminal de `wrangler dev` que el middleware de logging
imprime una línea por cada request.
