import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con el binding AI
// Hint: el tipo del binding AI es `Ai` (de @cloudflare/workers-types)
type Bindings = {
  // TODO: añadir AI: Ai
};

// Sistema de prompt para el asistente
const SYSTEM_PROMPT =
  "Eres un asistente técnico experto en Cloudflare Workers. " +
  "Responde siempre en español de forma clara y concisa. " +
  "Limita tus respuestas a 3 párrafos como máximo.";

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// Schema de validación para los endpoints de chat
const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

// ============================================
// PASO 1: POST /chat — respuesta completa
// ============================================

app.post("/chat", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Llama a c.env.AI.run() con el modelo "@cf/meta/llama-3.1-8b-instruct"
  // Inputs:
  //   messages: [
  //     { role: "system", content: SYSTEM_PROMPT },
  //     { role: "user", content: message },
  //   ],
  //   max_tokens: 512,
  // Hint: el resultado tiene la propiedad `response` con el texto generado
  // TODO: Devuelve { reply: result.response } como JSON
});

// ============================================
// PASO 2: POST /chat/stream — streaming SSE
// ============================================

app.post("/chat/stream", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Llama a c.env.AI.run() con el mismo modelo y los mismos mensajes
  // Añade `stream: true` a los inputs para obtener un ReadableStream
  // Hint: el tipo de retorno cambia a ReadableStream cuando stream: true
  // TODO: Devuelve new Response(stream as ReadableStream, {
  //   headers: {
  //     "Content-Type": "text/event-stream",
  //     "Cache-Control": "no-cache",
  //   },
  // })
});

// ============================================
// PASO 3: GET /models — listar modelos disponibles
// ============================================

// TODO: Implementa GET /models que devuelva un JSON con los modelos
// que has usado en este ejercicio y su task type
// Ejemplo: { models: [{ name: "@cf/meta/llama-3.1-8b-instruct", task: "text-generation" }] }

export default app;
