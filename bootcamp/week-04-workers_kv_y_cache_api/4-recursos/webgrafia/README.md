# Webgrafía — Semana 04: Workers KV y Cache API

## Workers KV

- [**KV · Get started**](https://developers.cloudflare.com/kv/get-started/)
  Guía oficial para crear un namespace, añadir el binding y realizar las
  primeras operaciones desde un Worker.

- [**KV · API Reference**](https://developers.cloudflare.com/kv/api/)
  Referencia completa de `get`, `put`, `delete`, `list` y `getWithMetadata`
  con tipos TypeScript y ejemplos.

- [**KV · Concepts · How KV works**](https://developers.cloudflare.com/kv/concepts/how-kv-works/)
  Explica la consistencia eventual, la replicación global y los límites
  (25 MB por valor, 512 B por llave, 1B llaves por namespace).

## Cache API

- [**Cache API · How it works**](https://developers.cloudflare.com/workers/runtime-apis/cache/)
  Documentación oficial de `caches.default`, `cache.match`, `cache.put`,
  `cache.delete` y el comportamiento en `wrangler dev` vs producción.

- [**Cache-Control headers**](https://developers.cloudflare.com/cache/concepts/cache-control/)
  Referencia de directivas `max-age`, `public`, `no-store` y cómo las
  interpreta la red de Cloudflare.

## ExecutionContext

- [**waitUntil · ExecutionContext**](https://developers.cloudflare.com/workers/runtime-apis/context/)
  Explica `ctx.waitUntil` y `ctx.passThroughOnException`; imprescindible
  para entender el guardado en caché en background sin bloquear la respuesta.
