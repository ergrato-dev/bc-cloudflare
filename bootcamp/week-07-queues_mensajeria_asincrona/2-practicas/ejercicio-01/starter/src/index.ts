import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con la propiedad NOTIFICATIONS_QUEUE
// Hint: usa Queue como tipo (sin genérico por ahora)
type Bindings = {
  // TODO: añadir NOTIFICATIONS_QUEUE: Queue
};

// Tipo del evento que viaja por la Queue
type NotificationEvent = {
  userId: string;
  message: string;
  sentAt: string;
};

// ============================================
// VALIDACIÓN
// ============================================

const notifySchema = z.object({
  userId: z.string().min(1),
  message: z.string().min(1).max(200),
});

// ============================================
// PASO 1: App HTTP — Productor
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// TODO: Registra el endpoint POST /notify
// Hint: usa zValidator("json", notifySchema) como middleware
// Luego: c.env.NOTIFICATIONS_QUEUE.send({ ...body, sentAt: new Date().toISOString() })
// Devuelve: c.json({ queued: true }, 202)
app.post("/notify", /* TODO: zValidator */ async (c) => {
  // TODO: obtener body validado con c.req.valid("json")
  // TODO: enviar a la queue con send()
  // TODO: devolver 202
  return c.json({ message: "implementar" });
});

// ============================================
// PASO 2: Ruta de prueba
// ============================================

app.get("/", (c) => c.json({ service: "notifications", status: "ok" }));

// ============================================
// PASO 3: Handler consumidor — queue()
// ============================================

// TODO: Añade el handler queue al objeto exportado
// Hint: el tipo es:
//   async queue(batch: MessageBatch<NotificationEvent>, env: Env): Promise<void>
// Para cada msg:
//   - imprime userId y message con console.log
//   - llama msg.ack() en éxito
//   - llama msg.retry() en el catch

export default {
  fetch: app.fetch,
  // TODO: añadir queue handler aquí
};
