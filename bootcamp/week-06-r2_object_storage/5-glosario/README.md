# Glosario — Semana 06

> **R2: Object Storage**

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## B

**`BUCKET.delete(key)`**
Elimina un objeto de R2 por su clave. No lanza error si el objeto no existe —
verifica con `head()` antes si necesitas confirmación.

**`BUCKET.get(key)`**
Descarga un objeto de R2. Devuelve `R2ObjectBody | null`.
Para leer el contenido: `object.body` (ReadableStream), `object.arrayBuffer()`, `object.text()`.

**`BUCKET.head(key)`**
Verifica la existencia y obtiene los metadatos de un objeto sin descargar su
cuerpo. Devuelve `R2Object | null`. Más eficiente que `get()` para verificar existencia.

**`BUCKET.list(options)`**
Lista objetos en el bucket. Soporta `prefix`, `cursor`, `limit` y `delimiter`
para simular carpetas. Devuelve `{ objects, truncated, cursor }`.

**`BUCKET.put(key, body, options)`**
Sube un objeto a R2. `body` puede ser `ArrayBuffer`, `ReadableStream`, `string`
o `Blob`. `options` acepta `httpMetadata` y `customMetadata`.

## C

**`cursor`**
Token opaco devuelto por `R2Objects.cursor` cuando `truncated === true`.
Pásalo en la siguiente llamada a `list()` para obtener la siguiente página.

**`customMetadata`**
Diccionario de pares `string → string` adjunto a un objeto R2.
Máximo 2 KB. Útil para datos del dominio (IDs, categorías, autoría).

## E

**Egress**
Tráfico de datos saliente de un proveedor cloud hacia Internet.
R2 **no cobra egress**, a diferencia de S3 o GCS donde puede costar $0.09/GB.

## H

**`httpMetadata`**
Metadatos HTTP estándar de un objeto R2: `contentType`, `contentDisposition`,
`cacheControl`, `contentEncoding`. Se aplican como headers al servir el objeto.

## M

**Multipart Upload**
Protocolo para subir archivos grandes en partes independientes (mínimo 5 MB
por parte, excepto la última). Tres fases: `createMultipartUpload` →
`uploadPart` → `complete` (o `abort`).

## O

**Object key**
Identificador único de un objeto dentro de un bucket R2. No hay sistema de
directorios real; un `/` en la key es solo parte del nombre.

## P

**`preview_bucket_name`**
Bucket alternativo usado en entorno local (`wrangler dev`). Permite desarrollar
sin modificar el bucket de producción.

## R

**R2**
Object storage de Cloudflare integrado con Workers. Almacena objetos de hasta
5 TB, sin costos de egress. Accesible via binding `R2Bucket` o compatible S3 API.

**`R2Bucket`**
Tipo TypeScript del binding R2 en Workers (`@cloudflare/workers-types`).
Expone: `put()`, `get()`, `head()`, `delete()`, `list()`, `createMultipartUpload()`.

**`R2ObjectBody`**
Subtipo de `R2Object` que incluye el `body: ReadableStream`. Devuelto por `get()`.
Tiene el método `writeHttpMetadata(headers)`.

## T

**Token temporal**
UUID almacenado en KV con TTL que mapea a un objeto R2. Permite conceder
acceso de descarga por tiempo limitado sin exponer la key real del objeto.

**`truncated`**
Booleano en la respuesta de `list()`. Si `true`, hay más objetos disponibles
y se debe usar el `cursor` para paginación.

## W

**`writeHttpMetadata(headers)`**
Método de `R2ObjectBody` que copia los campos de `httpMetadata` del objeto
(Content-Type, Content-Disposition, Cache-Control, ETag) al objeto `Headers`
que se pasará a la `Response`.
