# Webgrafía — Semana 03

Documentación oficial y referencias para Hono routing, Zod y JWT.

---

## Hono

- [Hono — Routing](https://hono.dev/docs/api/routing)
  Path params, query params, grupos de rutas y `app.route()`.

- [Hono — JWT Middleware](https://hono.dev/docs/middleware/builtin/jwt)
  Referencia de `sign`, `verify` y middleware JWT integrado.

- [Hono — RPC Client](https://hono.dev/docs/guides/rpc)
  Cómo exportar `AppType` y usar `hc<typeof app>()` para llamadas type-safe.

---

## Validación

- [Zod — Getting Started](https://zod.dev/?id=basic-usage)
  Guía oficial: schemas, tipos inferidos y manejo de errores.

- [@hono/zod-validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
  README del paquete: `zValidator`, targets (`json`, `param`, `query`) y callback de errores.

---

## JWT

- [jwt.io — Debugger](https://jwt.io)
  Herramienta interactiva para inspeccionar y decodificar tokens JWT.

- [RFC 7519 — JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519)
  Especificación oficial de JWT (estructura, claims estándar, expiración).
