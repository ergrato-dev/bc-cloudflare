# Ejercicio 02 — Dead Letter Queue y Reintentos

## Objetivo

Configurar una **Dead Letter Queue (DLQ)** para capturar mensajes que
agotan sus reintentos, y un consumidor DLQ que persiste los fallos en KV.

---

## Paso 1: Declarar DLQ en wrangler.jsonc

Necesitas **dos Queues**: la principal con `dead_letter_queue` apuntando a la DLQ,
y un consumidor adicional para la DLQ.

```jsonc
{
  "queues": {
    "producers": [
      { "queue": "jobs-queue", "binding": "JOBS_QUEUE" }
    ],
    "consumers": [
      {
        "queue": "jobs-queue",
        "max_batch_size": 5,
        "max_retries": 2,
        "dead_letter_queue": "jobs-dlq"
      },
      {
        "queue": "jobs-dlq",
        "max_batch_size": 10
      }
    ]
  },
  "kv_namespaces": [
    { "binding": "FAILED_KV", "id": "REPLACE_WITH_KV_ID" }
  ]
}
```

**Abre `starter/wrangler.jsonc`** y verifica la configuración.

---

## Paso 2: Productor con endpoint POST /jobs

```typescript
app.post("/jobs", zValidator("json", jobSchema), async (c) => {
  const { jobId, payload } = c.req.valid("json");
  await c.env.JOBS_QUEUE.send({ jobId, payload });
  return c.json({ queued: true, jobId }, 202);
});
```

**Abre `starter/src/index.ts`** y completa el TODO del endpoint POST `/jobs`.

---

## Paso 3: Consumidor principal — falla intencionalmente

Para probar la DLQ, el consumidor lanza un error en mensajes cuyo
`jobId` empieza con `"fail-"`.

```typescript
async queue(batch: MessageBatch<JobEvent>, env: Env): Promise<void> {
  for (const msg of batch.messages) {
    if (msg.body.jobId.startsWith("fail-")) {
      console.warn(`[jobs] simulando fallo: ${msg.body.jobId}`);
      msg.retry();   // forzamos reintento → irá a DLQ al agotar max_retries
    } else {
      console.log(`[jobs] procesado: ${msg.body.jobId}`);
      msg.ack();
    }
  }
}
```

**Abre `starter/src/index.ts`** y completa el TODO del consumidor principal.

---

## Paso 4: Consumidor DLQ — persiste en KV

El consumidor de la DLQ recibe los mensajes fallidos y los guarda en KV
para auditoría.

```typescript
async queueDlq(batch: MessageBatch<JobEvent>, env: Env): Promise<void> {
  for (const msg of batch.messages) {
    const key = `failed:${msg.body.jobId}:${Date.now()}`;
    await env.FAILED_KV.put(key, JSON.stringify(msg.body), { expirationTtl: 86400 });
    console.error(`[dlq] guardado: ${key}`);
    msg.ack();
  }
}
```

**Abre `starter/src/index.ts`** y completa el TODO del handler `queueDlq`.

---

## Paso 5: Probar

```bash
# Job normal — debe procesarse y ser ack
curl -X POST http://localhost:8787/jobs \
  -H "Content-Type: application/json" \
  -d '{"jobId": "ok-001", "payload": "procesar reporte"}'

# Job que falla — llegará a DLQ tras 2 reintentos
curl -X POST http://localhost:8787/jobs \
  -H "Content-Type: application/json" \
  -d '{"jobId": "fail-002", "payload": "operación problemática"}'
```

---

## Criterios de éxito

- [ ] `POST /jobs` devuelve 202 con `jobId`
- [ ] Mensajes con `jobId` que empieza en `"fail-"` van a la DLQ tras 2 reintentos
- [ ] El consumidor DLQ guarda el mensaje en KV con clave `failed:<jobId>:<ts>`
- [ ] Los mensajes normales hacen `ack()` inmediatamente
