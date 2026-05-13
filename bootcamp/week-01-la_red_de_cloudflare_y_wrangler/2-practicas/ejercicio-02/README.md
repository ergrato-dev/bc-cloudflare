# Ejercicio 02 — Primer Worker con Hono

Aprenderás a usar Hono como framework de routing en un Worker,
añadir middleware de logging y manejar errores de forma centralizada.

---

## Paso 1: Instalar y configurar Hono

Hono es el framework HTTP estándar para Workers en este bootcamp.
Su API es similar a Express pero está diseñada para el edge.

```typescript
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

export default app;
```

**Abre `starter/src/index.ts`** y completa el TODO 1.

---

## Paso 2: Rutas básicas GET

```typescript
app.get("/", (c) => c.text("Hola desde Hono"));
app.get("/ping", (c) => c.json({ pong: true }));
```

`c` es el Context de Hono — contiene `req`, `res` y helpers
como `c.json()`, `c.text()`, `c.html()`.

**Completa el TODO 2** con las 5 rutas del catálogo de ejemplo.

---

## Paso 3: Parámetros de ruta

```typescript
// GET /items/:id
app.get("/items/:id", (c) => {
  const id = c.req.param("id");
  return c.json({ id, found: true });
});
```

**Completa el TODO 3** para la ruta `/items/:id`.

---

## Paso 4: Middleware de logging

El middleware en Hono se registra con `app.use()` antes de las rutas.

```typescript
app.use("*", async (c, next) => {
  const start = Date.now();
  await next(); // ejecuta el handler de la ruta
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`);
});
```

**Completa el TODO 4** añadiendo este middleware antes de las rutas.

---

## Paso 5: Manejo de error 404

```typescript
app.notFound((c) => c.json({ error: "Not found" }, 404));
```

**Completa el TODO 5** con un handler 404 que devuelva JSON.

---

## Verificar

```bash
cd starter && pnpm install && pnpm dev
```

Prueba con curl o en el navegador:

```bash
curl http://localhost:8787/
curl http://localhost:8787/items
curl http://localhost:8787/items/42
curl http://localhost:8787/no-existe
```
