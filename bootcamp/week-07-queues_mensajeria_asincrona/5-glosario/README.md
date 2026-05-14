# Glosario — Semana 07

> **Queues: Mensajería Asíncrona**

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## A

**ack()** — Confirma que un mensaje fue procesado correctamente. El mensaje se
elimina de la Queue y no se reintenta. Equivalente a un "commit" en mensajería.

**ackAll()** — Confirma todos los mensajes del batch de una sola vez. Más
eficiente que llamar `ack()` mensaje por mensaje cuando todos tienen éxito.

**at-least-once** — Garantía de entrega de Cloudflare Queues: un mensaje se
entregará al menos una vez. Puede entregarse más de una vez si hay reintentos;
el consumidor debe ser idempotente.

## B

**batch** — Conjunto de mensajes entregados juntos al consumidor en una sola
invocación del handler `queue()`. El tamaño está controlado por `max_batch_size`.

**batch.queue** — Propiedad del `MessageBatch` que indica el nombre de la Queue
que originó la entrega. Útil para diferenciar la queue principal de la DLQ en
un mismo Worker.

## C

**consumer** — Worker que recibe y procesa mensajes de una Queue. Se declara en
`wrangler.jsonc` bajo `queues.consumers`. Implementa el handler `queue()`.

**content-type** — Formato en que se serializa el mensaje en la Queue. Opciones:
`json` (default), `text`, `bytes`, `v8`. Controla cómo se deserializa `msg.body`.

## D

**dead_letter_queue** — Nombre de la Queue destino para mensajes que agotaron
todos sus reintentos. Se declara en el consumidor: `"dead_letter_queue": "mi-dlq"`.

**Dead Letter Queue (DLQ)** — Queue secundaria que recibe mensajes fallidos tras
superar `max_retries`. Permite auditoría, alertas y replay manual.

**delaySeconds** — Tiempo en segundos antes de que un mensaje esté disponible
para el consumidor. Se puede establecer al producir (`send()`) o al reintentar
(`retry()`). Máximo: 43200 segundos (12 horas).

## F

**fan-out** — Patrón en el que un evento se envía a múltiples Queues distintas
en paralelo, cada una con su propio consumidor especializado. Logrado con
`Promise.all([queue1.send(...), queue2.send(...)])`.

## M

**max_batch_size** — Número máximo de mensajes que Cloudflare entregará al
consumidor en un solo batch. Valor máximo: 100.

**max_batch_timeout** — Tiempo máximo en segundos que Cloudflare espera para
completar un batch antes de entregarlo aunque tenga menos de `max_batch_size`.

**max_retries** — Número máximo de veces que un mensaje se reintenta si no
recibe `ack()`. Al superar este límite, el mensaje va a la DLQ (si está
configurada) o se descarta.

**MessageBatch** — Tipo TypeScript del parámetro `batch` del handler `queue()`.
Contiene `batch.messages` (array de `Message<T>`) y `batch.queue` (nombre).

**msg.body** — Contenido del mensaje decodificado. Si `content-type` es `json`
(default), es el objeto JavaScript original que se pasó a `send()`.

**msg.id** — Identificador único del mensaje asignado por Cloudflare. Útil para
idempotencia: guardarlo en KV antes de procesar para no procesar dos veces.

**msg.timestamp** — `Date` de cuándo fue encolado el mensaje originalmente.

## P

**pipeline** — Patrón donde un consumidor actúa también como productor de la
siguiente Queue, encadenando Workers en etapas de procesamiento.

**producer** — Worker (o binding) que envía mensajes a una Queue con `send()`
o `sendBatch()`. Se declara en `wrangler.jsonc` bajo `queues.producers`.

## Q

**Queue** — Tipo TypeScript de Cloudflare para el binding de productor de una
Queue. Expone los métodos `send()` y `sendBatch()`.

## R

**retry()** — Indica que un mensaje debe volver a la Queue para un nuevo intento.
Se puede pasar `{ delaySeconds: N }` para retrasar el reintento.

**retryAll()** — Reencola todos los mensajes del batch. Se usa cuando hay un
error de infraestructura (base de datos inaccesible, etc.) que afecta a todos.

## S

**send()** — Método de `Queue` para encolar un único mensaje. Acepta cualquier
valor serializable y opcionalmente `{ contentType, delaySeconds }`.

**sendBatch()** — Método de `Queue` para encolar múltiples mensajes en una sola
operación. Acepta un array de `{ body, contentType?, delaySeconds? }`.
Límite: 100 mensajes por llamada, 256 KB total.

