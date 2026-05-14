import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con:
//   JOBS_QUEUE: Queue
//   FAILED_KV: KVNamespace
type Bindings = {
  // TODO: añadir bindings
};

type JobEvent = {
  jobId: string;
  payload: string;
};

// ============================================
// VALIDACIÓN
// ============================================

const jobSchema = z.object({
  jobId: z.string().min(1),
  payload: z.string().min(1),
});

// ============================================
// PASO 1: Productor HTTP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// TODO: Registra POST /jobs con zValidator("json", jobSchema)
// Hint: envia el evento con c.env.JOBS_QUEUE.send({ jobId, payload })
// Devuelve: c.json({ queued: true, jobId }, 202)
app.post("/jobs", /* TODO: zValidator */ async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

app.get("/", (c) => c.json({ service: "jobs", status: "ok" }));

// ============================================
// PASO 2: Consumidor principal
// ============================================

// TODO: Implementa el handler queue() que:
//   - Si jobId empieza con "fail-": llama msg.retry() y loguea el aviso
//   - En caso contrario: llama msg.ack() y loguea el éxito
async function handleJobsQueue(
  batch: MessageBatch<JobEvent>,
  _env: Bindings
): Promise<void> {
  for (const msg of batch.messages) {
    // TODO: implementar lógica fail- vs ack
    msg.ack(); // reemplaza esto con la lógica correcta
  }
}

// ============================================
// PASO 3: Consumidor DLQ
// ============================================

// TODO: Implementa el handler queueDlq() que:
//   - Construye key = `failed:${msg.body.jobId}:${Date.now()}`
//   - Guarda en env.FAILED_KV con expirationTtl: 86400
//   - Loguea el key guardado
//   - Llama msg.ack()
async function handleDlqQueue(
  batch: MessageBatch<JobEvent>,
  _env: Bindings
): Promise<void> {
  for (const msg of batch.messages) {
    // TODO: implementar persistencia en KV
    msg.ack();
  }
}

export default {
  fetch: app.fetch,
  // TODO: conecta los handlers correctamente
  // Un Worker solo puede tener UN handler queue().
  // Hint: diferencia cuál queue está procesando con batch.queue
  async queue(batch: MessageBatch<JobEvent>, env: Bindings): Promise<void> {
    if (batch.queue === "jobs-dlq") {
      await handleDlqQueue(batch, env);
    } else {
      await handleJobsQueue(batch, env);
    }
  },
};
