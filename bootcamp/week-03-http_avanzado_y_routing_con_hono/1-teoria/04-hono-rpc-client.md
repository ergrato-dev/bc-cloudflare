# Hono RPC Client

## Objetivos

- Exportar el tipo de la app Hono para que el cliente conozca todas las rutas
- Crear un cliente type-safe con `hc<typeof app>()`
- Llamar a endpoints sin escribir strings de URL ni castear respuestas
- Entender cuándo usar RPC vs fetch clásico

---

## 1. El Problema con fetch Clásico

Con `fetch` sin tipos, cualquier error de ruta o de tipo solo se detecta en runtime:

```typescript
// ❌ Vulnerable a errores silenciosos de compilación
const res  = await fetch("https://my-api.workers.dev/prodcts"); // typo: prodcts
const data = await res.json() as { products: Product[] };      // cast sin garantía
```

Si renombras la ruta en el servidor, el cliente no falla en TypeScript — solo en producción.

---

## 2. Exportar el Tipo de la App

Para que el RPC client funcione, el Worker debe exportar el tipo de la app:

```typescript
// src/index.ts
import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>()
  .get("/products",     (c) => c.json({ products: PRODUCTS }))
  .get("/products/:id", (c) => c.json(PRODUCTS[0]))
  .post("/products",    (c) => c.json({ created: true }, 201));

export default app;

// El tipo de la app incluye todas las rutas y sus tipos de respuesta
export type AppType = typeof app;
```

La clave es el **method chaining** (`.get().post()...`) — Hono solo puede inferir
los tipos de las rutas cuando están encadenadas en la misma expresión.

---

## 3. Crear el Cliente con hc()

```typescript
// En otro archivo, en un test, o en otro Worker
import { hc } from "hono/client";
import type { AppType } from "./index"; // importa solo el tipo

const client = hc<AppType>("https://my-api.workers.dev");

// TypeScript conoce todas las rutas y sus tipos
const res     = await client.products.$get();
const { products } = await res.json();
// products es Product[] — no necesitas castear

// Ruta con path param
const res2   = await client.products[":id"].$get({ param: { id: "42" } });
const product = await res2.json();
```

> Las rutas con `-` se convierten en `_` en el cliente: `/user-sessions` → `client["user_sessions"]`

---

## 4. POST con Body Tipado

```typescript
// POST con body: TypeScript valida que el body tenga los campos correctos
const res = await client.products.$post({
  json: {
    name:     "The Witcher 3",
    price:    29.99,
    category: "rpg",
  },
});

const created = await res.json();
// TypeScript sabe exactamente qué devuelve el endpoint POST /products
```

Si cambias el schema Zod en el servidor, el cliente falla en TypeScript —
no en producción. Esto es el valor principal del RPC.

---

## 5. Uso en Tests y entre Workers

El cliente RPC es especialmente útil en dos contextos:

**Tests con Hono Test Client:**
```typescript
import { testClient } from "hono/testing";

// No necesitas levantar un servidor real
const client = testClient(app);
const res    = await client.products.$get();
expect(res.status).toBe(200);
```

**Entre Workers (preview de Semana 16):**
```typescript
// Worker B llama a Worker A via Service Binding
import { hc } from "hono/client";
import type { AppType } from "../worker-a/src/index";

// En Semana 16 veremos cómo tipear el Service Binding
const client = hc<AppType>("http://worker-a");
const res    = await client.products.$get();
```

---

## 6. RPC vs fetch: cuándo usar cada uno

| Caso                                        | Recomendación      |
|---------------------------------------------|--------------------|
| Llamadas entre Workers del mismo proyecto   | ✅ RPC Client      |
| Tests unitarios de la API                   | ✅ RPC Client      |
| Llamadas a APIs externas (GitHub, Stripe…)  | fetch clásico      |
| Prototipo rápido sin tipado estricto        | fetch clásico      |
| Producción con múltiples Workers tipados    | ✅ RPC Client      |

---

## ✅ Checklist

- [ ] ¿Exporto `AppType = typeof app` desde `index.ts` para el cliente RPC?
- [ ] ¿Uso method chaining (`.get().post()...`) para que Hono pueda inferir los tipos?
- [ ] ¿Importo `AppType` solo como tipo (`import type`) para no generar bundle extra?
- [ ] ¿En mis tests uso `testClient(app)` en lugar de `fetch` con URL hardcodeada?

---

## Referencias

- [Hono RPC](https://hono.dev/docs/guides/rpc)
- [Hono Testing](https://hono.dev/docs/guides/testing)
