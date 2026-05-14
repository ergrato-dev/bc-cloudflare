import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  JOBS_QUEUE: Queue;
  FAILED_KV: KVNamespace;
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
// Productor HTTP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

app.post("/jobs", zValidator("json", jobSchema), async (c) => {
  const { jobId, payload } = c.req.valid("json");
  await c.env.JOBS_QUEUE.send({ jobId, payload });
  return c.json({ queued: true, jobId }, 202);
});

app.get("/", (c) => c.json({ service: "jobs", status: "ok" }));

// ============================================
// Consumidor principal — falla intencionalmente en "fail-"
// ============================================

async function handleJobsQueue(
  batch: MessageBatch<JobEvent>,
  _env: Bindings
): Promise<void> {
  for (const msg of batch.messages) {
    if (msg.body.jobId.startsWith("fail-")) {
      console.warn(`[jobs] simulando fallo: ${msg.body.jobId} — reintentando`);
      msg.retry();
    } else {
      console.log(`[jobs] procesado correctamente: ${msg.body.jobId}`);
      msg.ack();
    }
  }
}

// ============================================
// Consumidor DLQ — persiste fallos en KV
// ============================================

async function handleDlqQueue(
  batch: MessageBatch<JobEvent>,
  env: Bindings
): Promise<void> {
  for (const msg of batch.messages) {
    const key = `failed:${msg.body.jobId}:${Date.now()}`;
    await env.FAILED_KV.put(key, JSON.stringify(msg.body), {
      expirationTtl: 86400,
    });
    console.error(`[dlq] guardado en KV: ${key}`);
    msg.ack();
  }
}

// ============================================
// Export — un solo handler queue() para ambas queues
// ============================================

export default {
  fetch: app.fetch,

  async queue(batch: MessageBatch<JobEvent>, env: Bindings): Promise<void> {
    if (batch.queue === "jobs-dlq") {
      await handleDlqQueue(batch, env);
    } else {
      await handleJobsQueue(batch, env);
    }
  },
};
