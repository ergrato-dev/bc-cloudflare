// ============================================
// EJERCICIO 01 — SOLUCIÓN
// ============================================

export interface Env {}

export default {
  async fetch(req: Request, _env: Env): Promise<Response> {
    // TODO 1: parsear URL
    const url = new URL(req.url);

    // TODO 3: ruta /greet (antes del switch para capturarla primero)
    if (url.pathname === "/greet") {
      const name = url.searchParams.get("name") ?? "visitante";
      return new Response(`Hola, ${name}!`);
    }

    // TODO 4: ruta /info
    if (url.pathname === "/info") {
      return Response.json({
        method: req.method,
        path: url.pathname,
        cf: req.headers.get("cf-ray") ?? "local",
      });
    }

    // TODO 2: switch de rutas principales
    switch (url.pathname) {
      case "/":
        return new Response("Bienvenido al edge");
      case "/health":
        return Response.json({ status: "ok", ts: Date.now() });
      default:
        return new Response("Not Found", { status: 404 });
    }
  },
};
