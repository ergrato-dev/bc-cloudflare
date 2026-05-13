# Routing Avanzado con Hono

## Objetivos

- Extraer path params y query params tipados desde una request
- Agrupar rutas con `app.route()` para proyectos modulares
- Aplicar middleware a prefijos específicos con `app.use("/prefix/*", ...)`
- Componer routers independientes por recurso o responsabilidad

> ![Diagrama de routing](../0-assets/01-routing-groups.svg)

---

## 1. Path Params

Los path params capturan segmentos dinámicos de la URL con la sintaxis `:nombre`:

```typescript
// Un solo param
app.get("/products/:id", (c) => {
  const id = c.req.param("id"); // siempre string
  return c.json({ id: Number(id) });
});

// Múltiples params: c.req.param() devuelve un objeto
app.get("/categories/:category/products/:id", (c) => {
  const { category, id } = c.req.param();
  return c.json({ category, id: Number(id) });
});
```

> `c.req.param()` siempre retorna `string`. Convierte a `Number()` si necesitas un entero.

---

## 2. Query Params

Los query params se obtienen con `c.req.query()`:

```typescript
// GET /products?category=rpg&limit=10&page=2
app.get("/products", (c) => {
  const category = c.req.query("category"); // string | undefined
  const limit    = Number(c.req.query("limit")  ?? "20");
  const page     = Number(c.req.query("page")   ?? "1");

  return c.json({ category, limit, page });
});

// Para params repetidos: GET /products?tag=js&tag=ts
// c.req.queries("tag") → ["js", "ts"]
app.get("/products/search", (c) => {
  const tags = c.req.queries("tag") ?? [];
  return c.json({ tags });
});
```

---

## 3. app.route() — Composición de Routers

`app.route()` monta un sub-router bajo un prefijo. Es la clave para separar
cada recurso en su propio archivo:

```typescript
import { Hono } from "hono";

// src/routes/products.ts
const productsRouter = new Hono<{ Bindings: Env }>();
productsRouter.get("/",    (c) => c.json({ products: PRODUCTS }));
productsRouter.get("/:id", (c) => c.json({ id: c.req.param("id") }));
productsRouter.post("/",   async (c) => c.json({ created: true }, 201));

export { productsRouter };

// src/index.ts
const app = new Hono<{ Bindings: Env }>();
app.route("/products", productsRouter);
// Resultado: GET /products, GET /products/:id, POST /products
```

El sub-router no sabe en qué prefijo está montado — solo define sus propias rutas.

---

## 4. Middleware por Prefijo

`app.use()` aplica un middleware únicamente a las rutas cuya URL coincida
con el patrón. Ideal para autenticación en grupos de rutas:

```typescript
const app = new Hono<{ Bindings: Env }>();

// Solo rutas que empiecen con /admin/
app.use("/admin/*", async (c, next) => {
  const apiKey = c.req.header("X-API-Key");
  if (apiKey !== c.env.ADMIN_KEY) {
    return c.json({ error: "No autorizado" }, 401);
  }
  await next();
});

app.get("/admin/stats",  (c) => c.json({ users: 120 })); // protegido
app.get("/products",     (c) => c.json({ products: [] })); // público
```

El orden importa: `app.use()` debe ir antes de las rutas que protege.

---

## 5. Wildcards y Patrones de Ruta

```typescript
// Wildcard: coincide con cualquier segmento posterior
app.get("/files/*", (c) => {
  const filePath = c.req.param("*"); // "docs/api/intro.md"
  return c.json({ path: filePath });
});

// Validación con regex inline (solo dígitos en :id)
app.get("/orders/:id{[0-9]+}", (c) => {
  const id = Number(c.req.param("id"));
  return c.json({ orderId: id });
  // Rutas como /orders/abc no hacen match → 404 automático
});
```

---

## 6. Estructura Modular de un Worker

Con `app.route()` el Worker se puede organizar como un proyecto real:

```
src/
├── index.ts            ← app principal: monta routers, declara middlewares
├── routes/
│   ├── products.ts     ← productsRouter (GET, POST, PATCH, DELETE)
│   ├── users.ts        ← usersRouter
│   └── auth.ts         ← authRouter (login, refresh)
└── middleware/
    ├── logging.ts      ← loggingMiddleware
    └── auth.ts         ← authMiddleware (JWT verify)
```

```typescript
// src/index.ts — solo orquestación, sin lógica de negocio
import { Hono } from "hono";
import { productsRouter } from "./routes/products";
import { usersRouter }    from "./routes/users";
import { loggingMiddleware } from "./middleware/logging";

const app = new Hono<{ Bindings: Env }>();

app.use("*", loggingMiddleware);
app.route("/products", productsRouter);
app.route("/users",    usersRouter);

export default app;
```

---

## ✅ Checklist

- [ ] ¿Valido que los path params son del tipo esperado antes de usarlos como número?
- [ ] ¿Uso `app.route()` para separar cada recurso en su propio archivo/router?
- [ ] ¿El middleware de `app.use("/prefix/*", ...)` está declarado antes de las rutas que protege?
- [ ] ¿Mi `index.ts` solo monta routers y middlewares, sin lógica de negocio?

---

## Referencias

- [Hono Routing](https://hono.dev/docs/api/routing)
- [Hono — app.route() Grouping](https://hono.dev/docs/api/routing#grouping)
- [Hono Middleware](https://hono.dev/docs/concepts/middleware)
