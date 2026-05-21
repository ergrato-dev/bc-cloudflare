import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// PROYECTO SEMANAL: Asistente AI Temático
// Semana 10 — Workers AI: Inferencia sin GPU propia
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// El elemento más importante es el SYSTEM_PROMPT — define el carácter
// y conocimiento de tu asistente.
//
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → asistente de salud animal
//   Escape room         → guía sin spoilers
//   Marina deportiva    → experto náutico
//   Librería digital    → recomendador literario

// ============================================
// CONFIGURACIÓN — adaptar al dominio
// ============================================

// TODO: Reemplaza este system prompt con uno específico para tu dominio.
// Debe tener más de 100 caracteres y definir el rol del asistente,
// el tono de respuesta y cualquier restricción de contenido.
const SYSTEM_PROMPT =
  "Eres un asistente inteligente. Responde siempre en español de forma clara. " +
  "Limita tus respuestas a 3 párrafos.";

// TODO: Actualiza este nombre para reflejar tu dominio asignado
const ASSISTANT_NAME = "Asistente AI";

// Modelo LLM a utilizar (no cambiar)
const LLM_MODEL = "@cf/meta/llama-3.1-8b-instruct";

// ============================================
// TIPOS
// ============================================

// TODO: Declara el binding AI con el tipo correcto
type Bindings = {
  // TODO: añadir AI: Ai
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// Schema de validación para los endpoints de chat
const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

// Schema de validación para el endpoint de embeddings
const embeddingSchema = z.object({
  text: z.string().min(1).max(512),
});

// ============================================
// TODO: POST /chat — respuesta completa JSON
// El cliente envía { message: string }
// Devuelve { assistant: string, reply: string }
// Hint: usa max_tokens: 512 para respuestas razonables
// ============================================

app.post("/chat", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");
  // TODO: implementar llamada al LLM con SYSTEM_PROMPT
  // TODO: devolver { assistant: ASSISTANT_NAME, reply: result.response }
});

// ============================================
// TODO: POST /chat/stream — streaming SSE
// El cliente envía { message: string }
// Devuelve un ReadableStream con Content-Type text/event-stream
// Hint: añade stream: true a los inputs del modelo
// ============================================

app.post("/chat/stream", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");
  // TODO: implementar streaming con stream: true
  // TODO: devolver new Response(stream as ReadableStream, { headers: { ... } })
});

// ============================================
// TODO: POST /embeddings — vector de texto
// El cliente envía { text: string }
// Devuelve { vector: number[], dimensions: number }
// Modelo: "@cf/baai/bge-base-en-v1.5"
// ============================================

app.post("/embeddings", zValidator("json", embeddingSchema), async (c) => {
  const { text } = c.req.valid("json");
  // TODO: implementar generación de embeddings
  // TODO: devolver { vector: result.data[0], dimensions: result.data[0].length }
});

// ============================================
// GET /health — estado del servicio (opcional para distinción)
// ============================================

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    assistant: ASSISTANT_NAME,
    model: LLM_MODEL,
    timestamp: new Date().toISOString(),
  });
});

export default app;
