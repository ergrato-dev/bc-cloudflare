import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// PROYECTO SEMANAL: Proxy AI con AI Gateway
// Semana 12 — AI Gateway: Proxy Inteligente
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Cambia el SYSTEM_PROMPT a algo relevante para tu dominio.
// Renombra las rutas /ask y /ask/fresh según tu contexto.
// Ejemplos:
//   Clínica veterinaria → /diagnose, /diagnose/fresh
//   Escape room         → /hint, /hint/fresh
//   Marina deportiva    → /weather-advice, /weather-advice/fresh

// ============================================
// TIPOS
// ============================================

type Bindings = {
  AI: Ai;
  STATS: KVNamespace;
  GATEWAY_ID: string;
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

const querySchema = z.object({
  message: z.string().min(1).max(2000),
});

// TODO: Personaliza el system prompt según tu dominio asignado
// Ejemplo para veterinaria: "Eres un asistente veterinario experto..."
// Ejemplo para escape room: "Eres el narrador de un escape room..."
const SYSTEM_PROMPT = "Eres un asistente experto. Responde en español, de forma clara y concisa.";

// ============================================
// HELPER: incrementar contador de llamadas
// ============================================

// TODO: Implementa esta función para contar llamadas por ruta en KV
// Hint: lee el valor actual con STATS.get(key), incrementa y guarda con STATS.put(key, nuevoValor)
async function incrementCallCount(stats: KVNamespace, route: string): Promise<void> {
  // TODO: implementar
}

// ============================================
// GET /stats — estadísticas de uso
// ============================================

app.get("/stats", async (c) => {
  // TODO: Lee los contadores de /ask y /ask/fresh desde KV
  // Hint: usa c.env.STATS.get("calls:/ask") y c.env.STATS.get("calls:/ask/fresh")
  // TODO: Devuelve un JSON con ambos contadores
});

// ============================================
// POST /ask — con caché del gateway
// ============================================

// TODO: Renombra esta ruta según tu dominio (/diagnose, /hint, /recommend, etc.)
app.post("/ask", zValidator("json", querySchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Llama a incrementCallCount para registrar esta llamada
  // TODO: Llama a c.env.AI.run() con el modelo "@cf/meta/llama-3.1-8b-instruct"
  //       Usa el SYSTEM_PROMPT que definiste arriba
  //       Configura el gateway con skipCache: false y cacheTtl: 3600
  // TODO: Devuelve { reply: result.response } como JSON
});

// ============================================
// POST /ask/fresh — bypass de caché
// ============================================

// TODO: Renombra esta ruta también (e.g., /diagnose/fresh)
app.post("/ask/fresh", zValidator("json", querySchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Llama a incrementCallCount para registrar esta llamada
  // TODO: Misma llamada que /ask pero con skipCache: true
  // TODO: Devuelve { reply: result.response } como JSON
});

export default app;
