import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con AI y GATEWAY_ID
// Hint: AI es `Ai`, GATEWAY_ID es `string` (variable de entorno)
type Bindings = {
  // TODO: añadir AI: Ai
  // TODO: añadir GATEWAY_ID: string
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

const SYSTEM_PROMPT =
  "Eres un asistente técnico experto en Cloudflare. " +
  "Responde siempre en español, de forma clara y en máximo 3 párrafos.";

// ============================================
// PASO 1: POST /chat — con caché de AI Gateway
// ============================================

app.post("/chat", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Llama a c.env.AI.run() con "@cf/meta/llama-3.1-8b-instruct"
  // Inputs:
  //   messages: [
  //     { role: "system", content: SYSTEM_PROMPT },
  //     { role: "user", content: message },
  //   ],
  //   max_tokens: 512,
  // Opciones de gateway (tercer argumento):
  //   gateway: {
  //     id: c.env.GATEWAY_ID,
  //     skipCache: false,
  //     cacheTtl: 3600,
  //   }
  // Hint: el resultado tiene la propiedad `response` con el texto generado
  // TODO: Devuelve { reply: result.response } como JSON
});

// ============================================
// PASO 2: POST /chat/fresh — bypass de caché
// ============================================

app.post("/chat/fresh", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Misma llamada que /chat pero con skipCache: true
  // Hint: skipCache: true fuerza una nueva llamada al modelo ignorando caché
  // TODO: Devuelve { reply: result.response } como JSON
});

export default app;
