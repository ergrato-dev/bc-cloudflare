# Glosario — Semana 04: Workers KV y Cache API

Términos Cloudflare ordenados alfabéticamente.

---

## C

### Cache-aside
Patrón de lectura donde la aplicación consulta la caché primero; si hay un
MISS, carga el dato desde el origen, lo guarda en caché y lo devuelve.
KV y la Cache API siguen este patrón de forma explícita.

### Cache-Control
Cabecera HTTP que indica a los proxies y cachés cuánto tiempo almacenar
una respuesta. Directivas comunes: `public, max-age=300` (5 min público),
`no-store` (nunca cachear), `stale-while-revalidate=60`.

### `caches.default`
El objeto global de la Cache API en Workers. Proporciona la caché HTTP
local del PoP donde corre el Worker. No comparte entradas entre PoPs.

### `ctx.waitUntil`
Método de `ExecutionContext` que permite ejecutar una tarea asíncrona en
background después de enviar la respuesta al cliente.
Esencial para `cache.put` sin bloquear la respuesta.

## E

### Eventual consistency (consistencia eventual)
Modelo de datos de Workers KV: una escritura se propaga a todos los PoPs
en ~60 segundos, pero lecturas inmediatas pueden servir datos anteriores.
Aceptable para datos de baja volatilidad (config, catálogos, sesiones).

### `expirationTtl`
Opción de `KV.put` que define el tiempo de vida en segundos relativo al
momento de escritura. Mínimo: 60 segundos. Ejemplo: `{ expirationTtl: 3600 }`.

## K

### KV Namespace
Unidad lógica de almacenamiento de Workers KV. Contiene pares llave/valor
replicados globalmente. Se declara en `wrangler.jsonc` bajo `kv_namespaces`
y se accede en el Worker como `c.env.BINDING_NAME`.

### `KV.getWithMetadata()`
Variante de `KV.get()` que retorna `{ value, metadata }` en una sola
operación. Útil cuando necesitas datos del valor y metadata de filtrado.

### `KV.list()`
Lista llaves con un prefijo dado. Acepta `{ prefix, limit, cursor }` y
devuelve `{ keys, list_complete, cursor }`. Las llaves incluyen `metadata`
si se guardó con ella.

## M

### max-age
Directiva de `Cache-Control` que especifica en segundos cuánto tiempo
una caché puede servir la respuesta sin revalidar.
Ejemplo: `Cache-Control: public, max-age=300` → cacheable 5 minutos.

### Metadata (KV)
Objeto JSON ligero (≤ 1 024 B) almacenado junto a una llave de KV.
Disponible en `KV.list()` sin leer el valor completo.
Útil para filtrado, ordenación y cache-invalidation selectiva.

## N

### Namespace (KV)
Ver **KV Namespace**.

## P

### Prefix (KV keys)
Convención de diseño para agrupar llaves relacionadas.
Ejemplo: `products:1`, `products:2`. Permite `KV.list({ prefix: "products:" })`
para listar solo ese grupo sin escanear todo el namespace.

## S

### Stale-while-revalidate
Directiva de `Cache-Control` que permite servir una respuesta expirada mientras
se regenera en background. Ejemplo: `Cache-Control: max-age=60, stale-while-revalidate=30`.
Reduce latencia de usuario al coste de datos temporalmente desactualizados.

## T

### TTL (Time To Live)
Tiempo de vida de una entrada en caché o KV. Después del TTL el dato expira
y la próxima lectura lo recarga desde el origen.
En KV: opción `expirationTtl`. En Cache API: directiva `max-age`.

## W

### `waitUntil`
Ver **`ctx.waitUntil`**.
