# Queues — Mensajería Asíncrona

> ![Arquitectura Queues](../0-assets/01-queues-architecture.svg)

## Objetivos

- Entender qué es una Queue y cuándo usar mensajería asíncrona
- Crear una Queue con Wrangler y declarar bindings en `wrangler.jsonc`
- Enviar mensajes desde un Worker productor

## 1. Qué es una Queue

Una Queue es un canal de mensajes entre dos Workers.
El **productor** envía mensajes; el **consumidor** los procesa de forma
independiente y asíncrona — si el consumidor falla, el mensaje se reintenta.

| Característica | Valor |
|---------------|-------|
| Entrega | At-least-once |
| Tamaño máx. por mensaje | 128 KB |
| Retención máx. | 4 días |
| Concurrencia máx. de batch | 250 mensajes |

> Ideal para: notificaciones, procesamiento de eventos, integración con APIs lentas.

## 2. Crear la Queue y declarar bindings

```bash
# Crea la Queue en tu cuenta Cloudflare
wrangler queues create notifications-queue
```

```jsonc
// wrangler.jsonc — mismo Worker puede ser productor Y consumidor
{
  "queues": {
    "producers": [
      { "queue": "notifications-queue", "binding": "NOTIFICATIONS_QUEUE" }
    ],
    "consumers": [
      {
        "queue": "notifications-queue",
        "max_batch_size": 10,
        "max_batch_timeout": 5,
        "max_retries": 3
      }
    ]
  }
}
```

## 3. Enviar mensajes — productor

```typescript
type Env = { NOTIFICATIONS_QUEUE: Queue };

// Encola un mensaje JSON al recibir una petición HTTP
app.post("/events", async (c) => {
  const body = await c.req.json<{ userId: string; event: string }>();

  await c.env.NOTIFICATIONS_QUEUE.send(body);   // JSON por defecto

  return c.json({ queued: true }, 202);
});
```

## 4. Enviar batch de mensajes — `sendBatch`

```typescript
// Encola múltiples mensajes en una sola llamada (más eficiente)
app.post("/events/batch", async (c) => {
  const events = await c.req.json<Array<{ userId: string; event: string }>>();

  await c.env.NOTIFICATIONS_QUEUE.sendBatch(
    events.map((e) => ({ body: e }))
  );

  return c.json({ queued: events.length }, 202);
});
```

## 5. Tipos de content-type

| `contentType` | Uso |
|---------------|-----|
| `"json"` (defecto) | Objetos JS — serializa con `JSON.stringify` |
| `"text"` | Strings simples |
| `"bytes"` | `ArrayBuffer` (binario) |
| `"v8"` | Objetos complejos serializados por V8 |

## ✅ Checklist

- [ ] ¿Qué garantía de entrega ofrece Cloudflare Queues?
- [ ] ¿Cuál es el tamaño máximo de un mensaje en una Queue?
- [ ] ¿Cómo se diferencia `send()` de `sendBatch()`?
- [ ] ¿Para qué caso de uso es más adecuado usar una Queue en lugar de D1 directo?

## Referencias

- [Queues · Get started](https://developers.cloudflare.com/queues/get-started/)
- [Queues · JS API](https://developers.cloudflare.com/queues/configuration/javascript-apis/)
