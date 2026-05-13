# Error Handling y Middleware en Hono

## Objetivos

- Implementar error handling global con `app.onError` en Hono
- Usar `HTTPException` para errores semánticamente correctos
- Crear middleware de logging y timing reutilizable

---

## 1. El problema sin error handling

Sin un handler de errores global, cualquier excepción no capturada
hace que Cloudflare devuelva una respuesta 500 genérica al cliente,
sin cuerpo JSON ni información útil para el consumidor de la API.

```typescript
// ❌ Sin error handling — el cliente recibe "500 Internal Server Error"
// sin ningún cuerpo JSON
app.get("/items/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const item = await c.env.KV.get(`item:${id}`);
  return c.json(JSON.parse(item!)); // ← lanza si item es null
});
```

---

## 2. HTTPException — errores con semántica HTTP

Hono provee `HTTPException` para lanzar errores con el status correcto:

```typescript
import { Hono, HTTPException } from "hono";

app.get("/items/:id", async (c) => {
  const id = c.req.param("id");

  // Validación manual del parámetro
  if (!/^\d+$/.test(id)) {
    throw new HTTPException(400, { message: "El id debe ser un número entero" });
  }

  const raw = await c.env.KV.get(`item:${id}`);
  if (!raw) {
    throw new HTTPException(404, { message: `Item ${id} no encontrado` });
  }

  return c.json(JSON.parse(raw));
});
```

---

## 3. app.onError — handler global de errores

`app.onError` captura cualquier error no manejado en las rutas:

```typescript
// Siempre declarar onError antes de definir rutas
app.onError((err, c) => {
  // HTTPException: error esperado con status definido
  if (err instanceof HTTPException) {
    return c.json({ error: err.message, status: err.status }, err.status);
  }

  // Error inesperado — loguear con contexto
  console.error(`[ERROR] ${c.req.method} ${c.req.url}`, err);

  // No exponer detalles del error interno al cliente
  return c.json({ error: "Error interno del servidor" }, 500);
});
```

---

## 4. app.notFound — handler para rutas no encontradas

```typescript
app.notFound((c) => {
  return c.json(
    {
      error: "Ruta no encontrada",
      path: new URL(c.req.url).pathname,
      method: c.req.method,
    },
    404
  );
});
```

---

## 5. Middleware de logging con timing

Un middleware de logging registra cada request con su duración:

```typescript
import { Hono } from "hono";

const app = new Hono();

// Middleware: se ejecuta antes de cada request
app.use("*", async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = new URL(c.req.url).pathname;

  await next(); // ejecuta el handler de la ruta

  const ms = Date.now() - start;
  const status = c.res.status;
  console.log(`${method} ${path} → ${status} (${ms}ms)`);
});
```

Con este middleware, `wrangler tail` mostrará una línea por request:

```
GET /items → 200 (4ms)
POST /items → 201 (12ms)
GET /items/999 → 404 (1ms)
```

---

## ✅ Checklist

- [ ] ¿Tengo `app.onError` declarado antes de mis rutas?
- [ ] ¿Uso `HTTPException` con el status correcto (400, 404, 401, 422, 500)?
- [ ] ¿Mi middleware de logging no bloquea la respuesta al cliente?
- [ ] ¿`app.notFound` devuelve JSON con el path que no se encontró?

---

## Referencias

- [Hono Error Handling](https://hono.dev/docs/guides/error-handling)
- [Hono Middleware](https://hono.dev/docs/concepts/middleware)
