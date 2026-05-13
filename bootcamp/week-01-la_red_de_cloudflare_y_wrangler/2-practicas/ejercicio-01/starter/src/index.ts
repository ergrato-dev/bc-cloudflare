// ============================================
// EJERCICIO 01: Routing con URL en un Worker
// ============================================
// Objetivo: enrutar requests según el pathname
// sin usar ningún framework externo.

export interface Env {}

export default {
  async fetch(req: Request, _env: Env): Promise<Response> {
    // ============================================
    // TODO 1: Parsea la URL de la request entrante
    // Hint: const url = new URL(req.url)
    // ============================================

    // ============================================
    // TODO 2: Implementa las siguientes rutas:
    //   GET /         → texto plano "Bienvenido al edge"
    //   GET /health   → JSON { status: "ok", ts: Date.now() }
    //   default       → texto "Not Found" con status 404
    // Hint: usa un switch sobre url.pathname
    // ============================================

    // ============================================
    // TODO 3: Implementa la ruta GET /greet
    //   Lee el query param "name" de la URL
    //   Si no existe, usa "visitante" como valor por defecto
    //   Devuelve texto plano "Hola, {name}!"
    // Hint: url.searchParams.get("name") ?? "visitante"
    // ============================================

    // ============================================
    // TODO 4: Implementa la ruta GET /info
    //   Devuelve un JSON con:
    //     { method: string, path: string, cf: string }
    //   donde method = req.method, path = url.pathname,
    //   cf = req.headers.get("cf-ray") ?? "local"
    // Hint: usa Response.json({ ... })
    // ============================================

    return new Response("TODO: implementar routing", { status: 501 });
  },
};
