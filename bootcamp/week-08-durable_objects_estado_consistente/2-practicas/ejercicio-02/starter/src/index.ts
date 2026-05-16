import { Hono } from "hono";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Env con el binding RATE_LIMITER_DO
// Hint: el tipo es DurableObjectNamespace
type Env = {
  // TODO: añadir RATE_LIMITER_DO: DurableObjectNamespace
};

type RateLimitStatus = {
  allowed: boolean;
  hits: number;
  remaining: number;
  resetAt: number;
};

// ============================================
// DURABLE OBJECT — RateLimiterDO
// ============================================

const LIMIT = 10; // máximo 10 requests por ventana
const WINDOW_MS = 60_000; // ventana de 60 segundos

export class RateLimiterDO implements DurableObject {
  private storage: DurableObjectStorage;

  constructor(private state: DurableObjectState, _env: Env) {
    this.storage = state.storage;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // ============================================
    // PASO 1: POST /check — verificar y contar
    // ============================================
    // TODO: Si no hay alarma activa (getAlarm() === null):
    //   - Calcula resetAt = Date.now() + WINDOW_MS
    //   - Llama a this.state.storage.setAlarm(resetAt)
    //   - Guarda "resetAt" con storage.put("resetAt", resetAt)
    //
    // TODO: Lee "hits" del storage, incrementa en 1 y guárdalo
    // TODO: Calcula allowed = hits <= LIMIT
    // TODO: Devuelve Response.json({ allowed, hits, remaining, resetAt }, { status: 200 })
    if (url.pathname === "/check" && request.method === "POST") {
      // TODO: implementar
      return Response.json({ allowed: true, hits: 0, remaining: LIMIT, resetAt: 0 });
    }

    // ============================================
    // PASO 2: GET /status — estado de la ventana
    // ============================================
    // TODO: lee "hits" y "resetAt" del storage y devuelve el estado actual
    // Hint: allowed = hits < LIMIT
    if (url.pathname === "/status") {
      // TODO: implementar
      return Response.json({ allowed: true, hits: 0, remaining: LIMIT, resetAt: 0 });
    }

    return new Response("Not found", { status: 404 });
  }

  // ============================================
  // PASO 3: alarm() — resetear ventana
  // ============================================
  // TODO: Pon "hits" a 0 con storage.put("hits", 0)
  //       Borra "resetAt" con storage.delete("resetAt")
  //       Imprime un log con console.log("[ratelimit] Ventana reseteada")
  async alarm(): Promise<void> {
    // TODO: implementar
  }
}

// ============================================
// WORKER ROUTER
// ============================================

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 4: POST /ratelimit/:clientId/check
// ============================================
// TODO: Obtén el ID con idFromName(clientId), el stub, llama a stub.fetch("/check", POST)
//       Si allowed === false, devuelve status 429
//       Hint: const data = await res.json<RateLimitStatus>()
app.post("/ratelimit/:clientId/check", async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

// ============================================
// PASO 5: GET /ratelimit/:clientId/status
// ============================================
// TODO: Obtén el stub y llama a stub.fetch("/status")
app.get("/ratelimit/:clientId/status", async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

app.get("/", (c) => c.json({ service: "do-ratelimiter", status: "ok" }));

export default app;
