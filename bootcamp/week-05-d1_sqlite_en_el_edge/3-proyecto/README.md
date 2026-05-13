# Proyecto Semana 05 — API REST con D1 y DrizzleORM

Construirás una **API de catálogo completa** con D1 + DrizzleORM adaptada a
tu dominio asignado por el instructor.

**Tiempo estimado**: 2–2.5 horas

---

## Objetivos

- Configurar D1 como base de datos de producción
- Implementar CRUD completo con DrizzleORM
- Gestionar el schema con migraciones versionadas
- Aplicar paginación, filtros y batch statements

---

## Instrucciones

> **Adapta este Worker a tu dominio asignado.**
>
> Ejemplos de adaptación según dominio:
> - Clínica veterinaria → tabla `patients`, rutas `/patients`, `/appointments`
> - Marina deportiva → tabla `boats`, rutas `/boats`, `/berths`
> - Biblioteca → tabla `books`, rutas `/books`, `/loans`
> - Escape room → tabla `rooms`, rutas `/rooms`, `/bookings`

---

### Preparación

```bash
cd starter
pnpm install

# 1. Crea la base de datos en tu cuenta (solo para producción)
wrangler d1 create catalog-db

# 2. Copia el database_id al wrangler.jsonc (reemplaza REPLACE_WITH_YOUR_D1_ID)

# 3. Aplica las migraciones en local
wrangler d1 migrations apply catalog-db --local

# 4. Carga el seed (mínimo 20 registros de tu dominio)
wrangler d1 execute catalog-db --local --file=./seed.sql

# 5. Arranca el servidor de desarrollo
wrangler dev
```

---

## Entregables requeridos

| # | Descripción | Criterio |
|---|-------------|----------|
| 1 | Schema definido con `sqliteTable` | Tipos `$inferSelect` exportados |
| 2 | Migración versionada aplicada | `wrangler d1 migrations apply` sin errores |
| 3 | Seed con mínimo 20 registros | Datos del dominio asignado |
| 4 | `GET /items` con paginación | `?page=` y `?limit=` funcionales |
| 5 | `GET /items/:id` con 404 | Responde correctamente si no existe |
| 6 | `POST /items` con zValidator | Validación estricta con Zod |
| 7 | `PUT /items/:id` | Actualización correcta |
| 8 | `DELETE /items/:id` con batch | Usa `DB.batch` para borrar y actualizar stats |
| 9 | Worker deployado | URL de producción en la entrega |

---

## Starter

Ver `starter/src/index.ts` y `starter/src/db/schema.ts` para comenzar.
