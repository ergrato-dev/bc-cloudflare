import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  NOTIFICATIONS_QUEUE: Queue;
};

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
// App HTTP — Productor
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

app.post("/notify", zValidator("json", notifySchema), async (c) => {
  const { userId, message } = c.req.valid("json");

  await c.env.NOTIFICATIONS_QUEUE.send({
    userId,
    message,
    sentAt: new Date().toISOString(),
  });

  return c.json({ queued: true }, 202);
});

app.get("/", (c) => c.json({ service: "notifications", status: "ok" }));

// ============================================
// Handler consumidor
// ============================================

export default {
  fetch: app.fetch,

  async queue(
    batch: MessageBatch<NotificationEvent>,
    _env: Bindings
  ): Promise<void> {
    for (const msg of batch.messages) {
      try {
        console.log(
          `[notif] user=${msg.body.userId} msg="${msg.body.message}" sentAt=${msg.body.sentAt}`
        );
        msg.ack();
      } catch (err) {
        console.error(`[notif] error procesando ${msg.id}:`, err);
        msg.retry();
      }
    }
  },
};
