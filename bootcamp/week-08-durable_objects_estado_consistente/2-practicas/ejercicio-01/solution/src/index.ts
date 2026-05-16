import { Hono } from "hono";

// ============================================
// TIPOS
// ============================================

type Env = {
  COUNTER_DO: DurableObjectNamespace;
};

// ============================================
// DURABLE OBJECT — CounterDO
// ============================================

export class CounterDO implements DurableObject {
  private storage: DurableObjectStorage;

  constructor(state: DurableObjectState, _env: Env) {
    this.storage = state.storage;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const count = (await this.storage.get<number>("count")) ?? 0;
      return Response.json({ count });
    }

    if (url.pathname === "/increment" && request.method === "POST") {
      const current = (await this.storage.get<number>("count")) ?? 0;
      const next = current + 1;
      await this.storage.put("count", next);
      return Response.json({ count: next });
    }

    if (url.pathname === "/reset" && request.method === "DELETE") {
      await this.storage.transaction(async (txn) => {
        await txn.put("count", 0);
        await txn.put("resetAt", new Date().toISOString());
      });
      return Response.json({ reset: true });
    }

    return new Response("Not found", { status: 404 });
  }
}

// ============================================
// WORKER ROUTER
// ============================================

const app = new Hono<{ Bindings: Env }>();

app.get("/counter/:name", async (c) => {
  const id = c.env.COUNTER_DO.idFromName(c.req.param("name"));
  const stub = c.env.COUNTER_DO.get(id);
  const res = await stub.fetch("https://do/");
  return c.json(await res.json());
});

app.post("/counter/:name/increment", async (c) => {
  const id = c.env.COUNTER_DO.idFromName(c.req.param("name"));
  const stub = c.env.COUNTER_DO.get(id);
  const res = await stub.fetch("https://do/increment", { method: "POST" });
  return c.json(await res.json());
});

app.delete("/counter/:name/reset", async (c) => {
  const id = c.env.COUNTER_DO.idFromName(c.req.param("name"));
  const stub = c.env.COUNTER_DO.get(id);
  const res = await stub.fetch("https://do/reset", { method: "DELETE" });
  return c.json(await res.json());
});

app.get("/", (c) => c.json({ service: "do-counter", status: "ok" }));

export default app;
