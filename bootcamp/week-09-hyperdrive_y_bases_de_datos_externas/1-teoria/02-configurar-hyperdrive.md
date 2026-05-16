# Configurar Hyperdrive en un Worker

## Objetivos

- Crear un Hyperdrive config con `wrangler hyperdrive create`
- Declarar el binding en `wrangler.jsonc` con ID y local connection string
- Acceder al `connectionString` desde el Worker en tiempo de ejecución

## 1. Crear el Hyperdrive config

```bash
# Crea un Hyperdrive que apunta a tu PostgreSQL externo
wrangler hyperdrive create mi-db \
  --connection-string="postgresql://user:pass@host:5432/dbname"
```

El comando devuelve un **ID** (ej. `a1b2c3d4e5f6789abc`). Ese ID va en `wrangler.jsonc`.

## 2. Declarar el binding

```jsonc
{
  "name": "mi-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat_v2"],
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "a1b2c3d4e5f6789abc",
      // Solo para wrangler dev — se ignora en producción
      "localConnectionString": "postgresql://postgres:postgres@localhost:5432/mydb"
    }
  ]
}
```

> `localConnectionString` permite usar `wrangler dev` sin desplegar Hyperdrive.

## 3. Tipar el binding en TypeScript

```typescript
type Bindings = {
  HYPERDRIVE: Hyperdrive;
};

const app = new Hono<{ Bindings: Bindings }>();
```

El tipo `Hyperdrive` expone una sola propiedad relevante:

```typescript
interface Hyperdrive {
  connectionString: string; // URL de conexión PostgreSQL para el driver
}
```

## 4. Usar el connectionString

```typescript
import postgres from "postgres";

app.get("/health", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
  const [row] = await sql`SELECT NOW() AS ts`;
  await sql.end();
  return c.json({ ok: true, ts: row.ts });
});
```

> En producción, `HYPERDRIVE.connectionString` apunta al proxy de Cloudflare,
> no directamente al DB. El driver no necesita saber la diferencia.

## 5. Ciclo de vida del cliente

```typescript
// ✅ Crear dentro del handler — Hyperdrive reutiliza la conexión pooled
const sql = postgres(c.env.HYPERDRIVE.connectionString, { max: 5 });
try {
  const rows = await sql`SELECT * FROM items`;
  return c.json(rows);
} finally {
  await sql.end(); // libera la conexión al pool de Hyperdrive
}
```

## ✅ Checklist

- [ ] ¿Qué almacena el campo `id` en el binding de Hyperdrive en `wrangler.jsonc`?
- [ ] ¿Para qué sirve `localConnectionString` y cuándo se usa?
- [ ] ¿Cómo accede el Worker a la URL de conexión en tiempo de ejecución?
- [ ] ¿Qué pasa si no llamas `sql.end()` al finalizar el handler?

## Referencias

- [Hyperdrive · Get started](https://developers.cloudflare.com/hyperdrive/get-started/)
- [Hyperdrive · Bindings](https://developers.cloudflare.com/hyperdrive/configuration/bindings/)
