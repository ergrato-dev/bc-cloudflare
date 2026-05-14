# Ejercicio 01 — Productor y Consumidor de Notificaciones

## Objetivo

Implementar un Worker que actúe como **productor** (HTTP endpoint) y como
**consumidor** (handler `queue`) sobre la misma Queue.

---

## Paso 1: Binding de la Queue en wrangler.jsonc

Cloudflare Queues requiere declarar la binding como **productor** y la Queue
como **consumidor** en secciones separadas del mismo `wrangler.jsonc`.

```jsonc
{
  "queues": {
    "producers": [{ "queue": "notifications-queue", "binding": "NOTIFICATIONS_QUEUE" }],
    "consumers": [{ "queue": "notifications-queue", "max_batch_size": 5, "max_batch_timeout": 3 }]
  }
}
```

**Abre `starter/src/index.ts`** y completa el TODO del tipo `Env`.

---

## Paso 2: Endpoint productor — POST /notify

El endpoint recibe `{ userId, message }` validado con Zod y encola el evento.

```typescript
app.post("/notify", zValidator("json", notifySchema), async (c) => {
  const body = c.req.valid("json");
  await c.env.NOTIFICATIONS_QUEUE.send({
    userId: body.userId,
    message: body.message,
    sentAt: new Date().toISOString(),
  });
  return c.json({ queued: true }, 202);
});
```

**Abre `starter/src/index.ts`** y completa el TODO del endpoint POST `/notify`.

---

## Paso 3: Handler consumidor — queue()

El consumidor recibe un `MessageBatch` y procesa cada mensaje.
Usa `msg.ack()` para confirmar o `msg.retry()` si hay un error.

```typescript
async queue(batch: MessageBatch<NotificationEvent>, env: Env): Promise<void> {
  for (const msg of batch.messages) {
    try {
      console.log(`[notif] user=${msg.body.userId} msg="${msg.body.message}"`);
      msg.ack();
    } catch {
      msg.retry();
    }
  }
}
```

**Abre `starter/src/index.ts`** y completa el TODO del handler `queue`.

---

## Paso 4: Probar con Wrangler

```bash
# Terminal 1 — levanta el Worker
pnpm wrangler dev

# Terminal 2 — envía una notificación
curl -X POST http://localhost:8787/notify \
  -H "Content-Type: application/json" \
  -d '{"userId": "u-001", "message": "Tu pedido fue confirmado"}'

# Deberías ver en Terminal 1:
# [notif] user=u-001 msg="Tu pedido fue confirmado"
```

---

## Criterios de éxito

- [ ] `POST /notify` devuelve `{ queued: true }` con status 202
- [ ] El consumidor imprime cada mensaje en consola
- [ ] `msg.ack()` se llama en el flujo exitoso
- [ ] `msg.retry()` se llama si el procesamiento lanza excepción
