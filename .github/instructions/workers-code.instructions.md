---
applyTo: "bootcamp/**/starter/**,bootcamp/**/solution/**"
---

# Reglas para código de Workers (starter y solution)

## wrangler.jsonc — obligatorio

```jsonc
{
  "name": "nombre-del-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat_v2"],
}
```

- `compatibility_date`: fecha exacta pasada, nunca futura ni "latest"
- `nodejs_compat_v2`: siempre presente en `compatibility_flags`
- Bindings declarados con nombres en `SCREAMING_SNAKE_CASE`

## package.json — versiones exactas (NON-NEGOTIABLE)

```json
{
  "dependencies": {
    "hono": "4.7.4"
  },
  "devDependencies": {
    "typescript": "5.8.3",
    "wrangler": "3.114.4"
  }
}
```

- ❌ NUNCA `^`, `~`, `>=`, `*`, `latest`
- ✅ SIEMPRE versión exacta sin prefijos
- Consultar versión actual: `pnpm info <pkg> version`
- Instalar siempre con: `pnpm add <pkg>@X.Y.Z`
- `.npmrc` del proyecto ya incluye `save-exact=true` — no requiere flag global

## Auditoría CVE — obligatoria antes de instalar

Ejecutar **antes** de agregar cualquier dependencia nueva:

```sh
pnpm audit --audit-level moderate
```

- Si hay vulnerabilidades `moderate`, `high` o `critical`: no instalar hasta resolver
- Reportar al instructor si un paquete requerido tiene CVEs sin fix disponible

## tsconfig.json — strict siempre

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "types": ["@cloudflare/workers-types"]
  }
}
```

## Estructura de src/index.ts

```typescript
import { Hono } from "hono";

// Tipos de bindings siempre explícitos
type Bindings = {
  DB: D1Database; // ejemplo — solo incluir los que el Worker usa
  KV: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

// Rutas aquí

export default app;
```

## D1 — prepared statements obligatorios

```typescript
// ✅ Correcto
await c.env.DB.prepare("SELECT * FROM items WHERE id = ?").bind(id).first();

// ❌ Prohibido — SQL Injection
await c.env.DB.prepare(`SELECT * FROM items WHERE id = ${id}`).first();
```

## Validación con Zod — obligatoria en mutaciones

```typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const schema = z.object({ name: z.string().min(1).max(100) });

app.post("/items", zValidator("json", schema), async (c) => {
  const { name } = c.req.valid("json");
  // ...
});
```

## Volumen mínimo de datos de prueba

| Semanas | Mínimo en seed        |
| ------- | --------------------- |
| 01–04   | 10 ítems en arrays/KV |
| 05–09   | 20 filas en D1        |
| 10–21   | 50 filas en D1        |

Los datos deben tener **distribuciones desiguales** para que los ejercicios
de filtrado y agregación sean significativos.
