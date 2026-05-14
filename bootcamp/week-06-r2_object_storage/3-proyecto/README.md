# Proyecto Semana 06 — Biblioteca de Archivos con R2

Construirás una **API de biblioteca de archivos** con R2 + KV adaptada a
tu dominio asignado por el instructor.

**Tiempo estimado**: 2–2.5 horas

---

## Objetivos

- Configurar R2 como backend de almacenamiento de producción
- Implementar CRUD de archivos con `customMetadata` del dominio
- Proteger descargas con tokens temporales en KV
- Manejar paginación con `cursor` en el listado

---

## Instrucciones

> **Adapta este Worker a tu dominio asignado.**
>
> Ejemplos de adaptación según dominio:
> - Clínica veterinaria → `/animals/:id/records` (historiales médicos PDF)
> - Marina deportiva    → `/boats/:id/documents` (certificados, planos)
> - Biblioteca          → `/books/:id/cover` (portadas, archivos EPUB)
> - Escape room         → `/rooms/:id/media` (fotos, videos promocionales)

---

### Preparación

```bash
cd starter
pnpm install

# Crea el bucket R2 en tu cuenta
wrangler r2 bucket create media-bucket

# Crea el KV namespace para tokens
wrangler kv namespace create TOKENS

# Copia los IDs al wrangler.jsonc
wrangler dev
```

---

## Entregables requeridos

| # | Descripción | Criterio |
|---|-------------|----------|
| 1 | `PUT /files/:key` con `customMetadata` del dominio | Mínimo 3 campos |
| 2 | `GET /files` con paginación por cursor | `truncated` + `cursor` funcionales |
| 3 | `GET /files/:key` con headers correctos | `Content-Type` + `Content-Disposition` |
| 4 | `DELETE /files/:key` con verificación de existencia | 404 si no existe |
| 5 | `POST /files/:key/token` con TTL configurable | TTL máximo 24h |
| 6 | `GET /download/:token` valida el token | 403 si expirado |
| 7 | Worker deployado con URL de producción | URL en la entrega |

---

## Starter

Ver `starter/src/index.ts` para los TODOs de implementación.
