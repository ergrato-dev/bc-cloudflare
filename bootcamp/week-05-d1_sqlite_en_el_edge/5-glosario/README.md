# Glosario — Semana 05

> **D1: SQLite en el Edge**

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

> # Glosario — Semana 05: D1 SQLite en el Edge

## A

**`.all<T>()`**
Método de un prepared statement D1 que ejecuta una query `SELECT` y devuelve
`{ results: T[], success: boolean, meta: object }`. Úsalo para múltiples filas.

## B

**Batch statements (`DB.batch()`)**
Ejecuta un array de prepared statements en un solo round-trip HTTP a D1.
Las operaciones son atómicas: si una falla, el batch completo falla.
```typescript
await DB.batch([stmt1, stmt2]);
```

## D

**D1**
Base de datos SQLite serverless de Cloudflare, accesible desde Workers con
latencia de borde. Soporta hasta 10 GB por base de datos y replicación de
lectura por PoP.

**`D1Database`**
Tipo TypeScript del binding D1 en Workers (`@cloudflare/workers-types`).
Expone: `prepare()`, `batch()`, `exec()`, `dump()`.

**`database_id`**
Identificador único (UUID) asignado por Cloudflare al crear una base de datos
D1 con `wrangler d1 create <name>`. Requerido en `wrangler.jsonc`.

**`drizzle(DB)`**
Función de `drizzle-orm/d1` que crea un cliente DrizzleORM sobre un binding D1.
```typescript
const db = drizzle(c.env.DB);
```

**DrizzleORM**
ORM TypeScript ligero que compila a SQL nativo. Soporta D1 via
`drizzle-orm/d1`. No usa metadatos en runtime: el schema es código TypeScript.

**drizzle-kit**
CLI de DrizzleORM que genera migraciones SQL (`drizzle-kit generate`) y aplica
cambios al schema. Config en `drizzle.config.ts`.

## F

**`.first<T>()`**
Método de prepared statement D1 que devuelve el primer resultado como `T | null`.
Para queries que esperan un solo registro (ej. `WHERE id = ?`).

## I

**`$inferInsert`**
Tipo TypeScript inferido del schema DrizzleORM para operaciones INSERT.
Los campos con `default` o `autoIncrement` son opcionales.

**`$inferSelect`**
Tipo TypeScript inferido del schema DrizzleORM para operaciones SELECT.
Todos los campos son requeridos según el schema.

## M

**Migrations**
Archivos SQL versionados en `migrations/` que describen cambios al schema.
D1 mantiene historial en la tabla `d1_migrations`. Se aplican con
`wrangler d1 migrations apply <db-name>`.

## O

**OFFSET**
Cláusula SQL para saltar `n` filas. Junto con `LIMIT` implementa paginación:
`OFFSET = (page - 1) * limit`.

## P

**Prepared statement**
Query SQL precompilada con placeholders `?` para los valores dinámicos.
Previene SQL Injection y mejora rendimiento. En D1: `DB.prepare(sql).bind(...)`.

## R

**RETURNING**
Cláusula SQLite que retorna las filas afectadas por un `INSERT`, `UPDATE` o
`DELETE`. Equivalente a un `SELECT` del registro recién modificado.
```sql
INSERT INTO items (name) VALUES (?) RETURNING *
```

**`.run()`**
Método de prepared statement D1 para mutaciones sin retorno de filas
(`INSERT`, `UPDATE`, `DELETE`). Devuelve `{ success: boolean, meta: object }`.

## S

**Seed**
Archivo SQL (`seed.sql`) con `INSERT` de datos de prueba iniciales.
Se aplica con `wrangler d1 execute <db-name> --local --file=./seed.sql`.
Requerido: mínimo 20 filas en Etapa 1 del bootcamp.

**`sqliteTable`**
Función de `drizzle-orm/sqlite-core` para definir tablas en DrizzleORM.
```typescript
export const users = sqliteTable("users", { id: integer("id").primaryKey() });
```

## W

**WAL (Write-Ahead Logging)**
Modo de escritura de SQLite que permite lecturas concurrentes durante una
escritura. D1 opera en WAL mode por defecto, habilitando las réplicas de lectura..
