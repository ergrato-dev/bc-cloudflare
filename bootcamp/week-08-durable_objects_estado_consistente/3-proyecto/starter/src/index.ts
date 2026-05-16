import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// PROYECTO SEMANAL: Gestor de Estado con DOs
// Semana 08 — Durable Objects: Estado Consistente
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → estados: libre, reservado, en_curso, completado
//   Escape room         → estados: disponible, reservada, en_juego, finalizada
//   Marina deportiva    → estados: libre, reservado, ocupado, liberado
//   Librería            → estados: disponible, apartado, vendido, devuelto

// ============================================
// TIPOS — adapta los estados a tu dominio
// ============================================

// TODO: Define los estados válidos para los recursos de tu dominio
// Hint: reemplaza estos estados de ejemplo con los de tu dominio
type ResourceState = "available" | "reserved" | "active" | "completed";

type ResourceStatus = {
  id: string;
  state: ResourceState;
  updatedAt: string;
  createdAt: string;
};

type HistoryEntry = {
  from: ResourceState | null;
  to: ResourceState;
  at: string;
};

// TODO: Define el tipo Env con el binding RESOURCE_DO
type Env = {
  // TODO: añadir RESOURCE_DO: DurableObjectNamespace
};

// ============================================
// VALIDACIÓN
// ============================================

// TODO: Ajusta los estados al enum de tu dominio
const transitionSchema = z.object({
  state: z.enum(["available", "reserved", "active", "completed"]),
  note: z.string().max(200).optional(),
});

// ============================================
// DURABLE OBJECT — ResourceDO
// ============================================

export class ResourceDO implements DurableObject {
  private storage: DurableObjectStorage;

  constructor(private state: DurableObjectState, _env: Env) {
    this.storage = state.storage;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // ============================================
    // TODO: GET / — leer estado actual del recurso
    // ============================================
    // Hint: lee "status" del storage (tipo ResourceStatus)
    // Si no existe, devuelve un status inicial con state: "available"
    // y createdAt / updatedAt con new Date().toISOString()
    if (url.pathname === "/" && request.method === "GET") {
      // TODO: implementar
      return Response.json({ error: "implementar" }, { status: 501 });
    }

    // ============================================
    // TODO: POST /transition — cambiar estado
    // ============================================
    // Hint: parsea el body como { state, note? }
    //       usa storage.transaction() para actualizar el status y añadir al historial
    //       reprograma la Alarm a 30 minutos en el futuro (expiración por inactividad)
    //       el historial se guarda como array en la clave "history" (máx. 20 entradas)
    if (url.pathname === "/transition" && request.method === "POST") {
      // TODO: implementar
      return Response.json({ error: "implementar" }, { status: 501 });
    }

    // ============================================
    // TODO: GET /history — historial de transiciones
    // ============================================
    // Hint: lee la clave "history" del storage (tipo HistoryEntry[])
    if (url.pathname === "/history" && request.method === "GET") {
      // TODO: implementar
      return Response.json({ history: [] });
    }

    // ============================================
    // TODO: POST /expire — forzar expiración
    // ============================================
    // Hint: pon el state a "available", borra la Alarm con deleteAlarm()
    if (url.pathname === "/expire" && request.method === "POST") {
      // TODO: implementar
      return Response.json({ expired: false });
    }

    return new Response("Not found", { status: 404 });
  }

  // ============================================
  // TODO: alarm() — expirar el recurso por inactividad
  // ============================================
  // Hint: pon el estado del recurso a "available" y registra en el historial
  async alarm(): Promise<void> {
    // TODO: implementar
    console.log("[resource-do] Expiración por inactividad");
  }
}

// ============================================
// WORKER ROUTER
// ============================================

const app = new Hono<{ Bindings: Env }>();

// TODO: GET /resources/:id — leer estado del recurso
// Hint: idFromName(:id), stub.fetch("https://do/")
app.get("/resources/:id", async (c) => {
  // TODO: implementar
  return c.json({ error: "implementar" }, 501);
});

// TODO: POST /resources/:id/transition — cambiar estado con validación Zod
// Hint: usa zValidator("json", transitionSchema) como middleware
//       pasa el body al DO como JSON en el body del fetch
app.post(
  "/resources/:id/transition",
  zValidator("json", transitionSchema),
  async (c) => {
    // TODO: implementar
    return c.json({ error: "implementar" }, 501);
  }
);

// TODO: GET /resources/:id/history — historial de transiciones
app.get("/resources/:id/history", async (c) => {
  // TODO: implementar
  return c.json({ history: [] });
});

// TODO: POST /resources/:id/expire — forzar expiración
app.post("/resources/:id/expire", async (c) => {
  // TODO: implementar
  return c.json({ expired: false });
});

app.get("/", (c) => c.json({ service: "do-resource-manager", status: "ok" }));

export default app;
