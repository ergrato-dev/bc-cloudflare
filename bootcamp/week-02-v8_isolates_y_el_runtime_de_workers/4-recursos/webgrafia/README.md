# Webgrafía — Semana 02

Documentación oficial y artículos de referencia para los temas de la semana:
V8 Isolates, runtime de Workers, `nodejs_compat_v2` y error handling en Hono.

---

## Documentación Oficial Cloudflare

- **[How Workers works](https://developers.cloudflare.com/workers/reference/how-workers-works/)**
  Explica el modelo de V8 Isolates, el lifecycle de requests y el aislamiento multi-tenant.

- **[Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)**
  Referencia completa de las APIs disponibles en el runtime de Workers (fetch, Cache, crypto, etc.).

- **[Node.js compatibility](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)**
  Lista de módulos Node.js disponibles con `nodejs_compat_v2` y guías de migración.

- **[Limits](https://developers.cloudflare.com/workers/platform/limits/)**
  Límites actualizados: CPU time, memoria, bundle size, subrequests, Workers activos.

- **[wrangler tail](https://developers.cloudflare.com/workers/wrangler/commands/#tail)**
  Referencia del comando `wrangler tail` para observar logs y CPU time en tiempo real.

---

## Hono

- **[Error Handling](https://hono.dev/docs/guides/error-handling)**
  Documentación de `HTTPException`, `app.onError` y `app.notFound`.

- **[Middleware](https://hono.dev/docs/concepts/middleware)**
  Cómo funciona el sistema de middleware en Hono y cómo crear middleware personalizado.

---

## Artículos del Blog de Cloudflare

- **[Cloudflare Workers — From Cloud to the Edge](https://blog.cloudflare.com/)**
  El blog oficial publica novedades del runtime, nuevos módulos compatibles y
  mejoras de rendimiento. Filtra por tag "Workers".

- **[Node.js compatibility comes to Cloudflare Workers](https://blog.cloudflare.com/workers-node-js-asynclocalstorage/)**
  Post histórico explicando la evolución de la compatibilidad con Node.js en Workers.
