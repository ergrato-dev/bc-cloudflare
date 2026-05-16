import { Hono } from "hono";

// ============================================
// TIPOS
// ============================================

type Env = {
  RATE_LIMITER_DO: DurableObjectNamespace;
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

const LIMIT = 10;
const WINDOW_MS = 60_000;

export class RateLimiterDO implements DurableObject {
  private storage: DurableObjectStorage;

  constructor(private state: DurableObjectState, _env: Env) {
    this.storage = state.storage;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/check" && request.method === "POST") {
      // Programa la alarma si es la primera petición de la ventana
      const existingAlarm = await this.state.storage.getAlarm();
      if (existingAlarm === null) {
        const resetAt = Date.now() + WINDOW_MS;
        await this.state.storage.setAlarm(resetAt);
        await this.storage.put("resetAt", resetAt);
      }

      const hits = ((await this.storage.get<number>("hits")) ?? 0) + 1;
      await this.storage.put("hits", hits);

      const resetAt = (await this.storage.get<number>("resetAt")) ?? 0;
      const allowed = hits <= LIMIT;

      return Response.json({
        allowed,
        hits,
        remaining: Math.max(0, LIMIT - hits),
        resetAt,
      });
    }

    if (url.pathname === "/status") {
      const hits = (await this.storage.get<number>("hits")) ?? 0;
      const resetAt = (await this.storage.get<number>("resetAt")) ?? 0;

      return Response.json({
        allowed: hits < LIMIT,
        hits,
        remaining: Math.max(0, LIMIT - hits),
        resetAt,
      });
    }

    return new Response("Not found", { status: 404 });
  }

  async alarm(): Promise<void> {
    await this.storage.put("hits", 0);
    await this.storage.delete("resetAt");
    console.log("[ratelimit] Ventana reseteada");
  }
}

// ============================================
// WORKER ROUTER
// ============================================

const app = new Hono<{ Bindings: Env }>();

app.post("/ratelimit/:clientId/check", async (c) => {
  const id = c.env.RATE_LIMITER_DO.idFromName(c.req.param("clientId"));
  const stub = c.env.RATE_LIMITER_DO.get(id);
  const res = await stub.fetch("https://do/check", { method: "POST" });
  const data = await res.json<RateLimitStatus>();
  return c.json(data, data.allowed ? 200 : 429);
});

app.get("/ratelimit/:clientId/status", async (c) => {
  const id = c.env.RATE_LIMITER_DO.idFromName(c.req.param("clientId"));
  const stub = c.env.RATE_LIMITER_DO.get(id);
  const res = await stub.fetch("https://do/status");
  return c.json(await res.json());
});

app.get("/", (c) => c.json({ service: "do-ratelimiter", status: "ok" }));

export default app;
