import { Hono } from "hono";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Env con el binding COUNTER_DO
// Hint: el tipo de un namespace de DO es DurableObjectNamespace
type Env = {
  // TODO: añadir COUNTER_DO: DurableObjectNamespace
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

    // ============================================
    // PASO 1: Ruta GET / — leer el contador
    // ============================================
    // TODO: lee la clave "count" del storage (tipo number)
    // Hint: usa this.storage.get<number>("count") ?? 0
    // Devuelve: Response.json({ count })
    if (url.pathname === "/") {
      // TODO: implementar
      return Response.json({ count: 0 });
    }

    // ============================================
    // PASO 2: Ruta POST /increment — incrementar
    // ============================================
    // TODO: lee el valor actual, súmale 1, guárdalo y devuelve el nuevo valor
    // Hint: storage.get<number>("count") ?? 0, luego storage.put("count", ...)
    if (url.pathname === "/increment" && request.method === "POST") {
      // TODO: implementar
      return Response.json({ count: 0 });
    }

    // ============================================
    // PASO 3: Ruta DELETE /reset — resetear a 0
    // ============================================
    // TODO: usa storage.transaction() para poner "count" a 0
    //       y guardar "resetAt" con new Date().toISOString()
    // Devuelve: Response.json({ reset: true })
    if (url.pathname === "/reset" && request.method === "DELETE") {
      // TODO: implementar
      return Response.json({ reset: false });
    }

    return new Response("Not found", { status: 404 });
  }
}

// ============================================
// WORKER ROUTER
// ============================================

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 4: GET /counter/:name — leer contador
// ============================================
// TODO: obtén el ID con c.env.COUNTER_DO.idFromName(name)
//       luego el stub con c.env.COUNTER_DO.get(id)
//       llama a stub.fetch("https://do/") y devuelve el JSON
app.get("/counter/:name", async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

// ============================================
// PASO 5: POST /counter/:name/increment
// ============================================
// TODO: igual que arriba, pero llama a stub.fetch("https://do/increment", { method: "POST" })
app.post("/counter/:name/increment", async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

// ============================================
// PASO 6: DELETE /counter/:name/reset
// ============================================
// TODO: llama a stub.fetch("https://do/reset", { method: "DELETE" })
app.delete("/counter/:name/reset", async (c) => {
  // TODO: implementar
  return c.json({ message: "implementar" });
});

app.get("/", (c) => c.json({ service: "do-counter", status: "ok" }));

export default app;
