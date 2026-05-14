import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// PROYECTO SEMANAL: Pipeline de Eventos con Queues
// Semana 07 — Queues: Mensajería Asíncrona
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Cambia "DomainEvent" por el evento de tu dominio:
//   Clínica veterinaria → AppointmentEvent { petId, vetId, date }
//   Escape room         → BookingEvent { roomId, groupSize, date }
//   Marina deportiva    → CheckInEvent { boatId, berthId, date }

// ============================================
// PASO 1: Define tus Bindings y el tipo de evento
// ============================================

// TODO: Declara el tipo Bindings con EVENTS_QUEUE y EVENTS_KV
type Bindings = {
  // EVENTS_QUEUE: Queue;
  // EVENTS_KV: KVNamespace;
};

// TODO: Define el tipo de evento de tu dominio
// Debe incluir al menos: id (string), y 2-3 campos relevantes
type DomainEvent = {
  id: string;
  // TODO: añadir campos según tu dominio
};

// ============================================
// PASO 2: Esquema de validación Zod
// ============================================

// TODO: Define el schema Zod para validar el body del POST /events
// Debe coincidir con los campos de DomainEvent
const eventSchema = z.object({
  id: z.string().uuid(),
  // TODO: añadir validaciones de campos de tu dominio
});

// ============================================
// PASO 3: Endpoint productor — POST /events
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// TODO: Implementa POST /events con zValidator("json", eventSchema)
// - Obtén el body validado
// - Envíalo a la queue con c.env.EVENTS_QUEUE.send(body)
// - Devuelve 202 con { queued: true, id: body.id }
app.post("/events", /* TODO: zValidator */ async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

// ============================================
// PASO 4: Rutas de consulta desde KV
// ============================================

// TODO: GET /events/processed — lista eventos procesados
// Hint: usa c.env.EVENTS_KV.list({ prefix: "processed:" })
app.get("/events/processed", async (c) => {
  // TODO: implementar
  return c.json({ events: [] });
});

// TODO: GET /events/failed — lista eventos fallidos (DLQ)
// Hint: usa c.env.EVENTS_KV.list({ prefix: "failed:" })
app.get("/events/failed", async (c) => {
  // TODO: implementar
  return c.json({ events: [] });
});

app.get("/", (c) => c.json({ service: "domain-events", status: "ok" }));

// ============================================
// PASO 5: Consumidor principal
// ============================================

// TODO: Implementa el procesamiento de eventos del dominio
// - Para cada mensaje: procesa, guarda en KV con "processed:<id>:<ts>", ack()
// - En caso de error: msg.retry()
async function handleEventsQueue(
  batch: MessageBatch<DomainEvent>,
  _env: Bindings
): Promise<void> {
  for (const msg of batch.messages) {
    // TODO: implementar lógica de procesamiento del dominio
    msg.ack();
  }
}

// ============================================
// PASO 6: Consumidor DLQ
// ============================================

// TODO: Implementa la captura de mensajes fallidos
// - Guarda en KV con clave "failed:<id>:<ts>" y expirationTtl: 86400
// - ack() siempre (la DLQ no debe generar más reintentos)
async function handleDlqQueue(
  batch: MessageBatch<DomainEvent>,
  _env: Bindings
): Promise<void> {
  for (const msg of batch.messages) {
    // TODO: implementar persistencia en KV de fallos
    msg.ack();
  }
}

// ============================================
// Export del Worker
// ============================================

export default {
  fetch: app.fetch,

  async queue(batch: MessageBatch<DomainEvent>, env: Bindings): Promise<void> {
    if (batch.queue.endsWith("-dlq")) {
      await handleDlqQueue(batch, env);
    } else {
      await handleEventsQueue(batch, env);
    }
  },
};
