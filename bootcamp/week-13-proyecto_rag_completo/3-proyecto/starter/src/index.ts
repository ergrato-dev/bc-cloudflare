import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// PROYECTO SEMANAL: Sistema RAG Completo
// Semana 13 — Proyecto RAG: D1 + R2 + Vectorize + Workers AI + SSE
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// 1. Cambia el SYSTEM_PROMPT a uno apropiado para tu dominio
// 2. Adapta las rutas si lo deseas (/documents → /articles, /policies, etc.)
// 3. Indexa al menos 10 documentos reales de tu dominio
// Ejemplos de adaptación:
//   Clínica veterinaria → documentos: fichas de cuidado animal
//   Escape room         → documentos: narrativa de salas, pistas
//   Marina deportiva    → documentos: regulaciones náuticas, guías

// ============================================
// TIPOS
// ============================================

type Bindings = {
  AI: Ai;
  DB: D1Database;
  BUCKET: R2Bucket;
  INDEX: VectorizeIndex;
};

type DocRow = {
  id: string;
  title: string;
  content: string;
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

const docSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(8000),
});

const querySchema = z.object({
  question: z.string().min(1).max(1000),
  topK: z.number().int().min(1).max(10).optional().default(3),
});

// TODO: Personaliza el system prompt para tu dominio
// Ejemplo: "Eres un asistente experto en [tu dominio]. Responde en español..."
const SYSTEM_PROMPT =
  "Responde en español basándote ÚNICAMENTE en el contexto proporcionado. " +
  "Si la respuesta no está en el contexto, dilo claramente.";

// ============================================
// HELPER: recuperar documentos relevantes
// ============================================

// TODO: Implementa la función retrieveDocs
// Pasos: 1) embed question con bge-base-en-v1.5
//        2) query Vectorize con topK
//        3) fetch docs de D1 con IN clause
async function retrieveDocs(
  ai: Ai,
  index: VectorizeIndex,
  db: D1Database,
  question: string,
  topK: number
): Promise<DocRow[]> {
  // TODO: implementar
  return [];
}

// ============================================
// POST /documents — pipeline de ingesta
// ============================================

app.post("/documents", zValidator("json", docSchema), async (c) => {
  const { title, content } = c.req.valid("json");

  // TODO: Genera un ID con crypto.randomUUID()
  // TODO: Guarda en R2 con BUCKET.put()
  // TODO: Inserta en D1 con prepared statement
  // TODO: Genera embedding con AI.run('@cf/baai/bge-base-en-v1.5', { text: [content] })
  // TODO: Haz upsert en Vectorize con INDEX.upsert()
  // TODO: Devuelve { id, title, message: 'Documento indexado' } con status 201
});

// ============================================
// GET /documents — listar documentos
// ============================================

app.get("/documents", async (c) => {
  // TODO: SELECT id, title, created_at FROM documents ORDER BY created_at DESC LIMIT 50
  // TODO: Devuelve el array como JSON
});

// ============================================
// POST /query — respuesta completa
// ============================================

app.post("/query", zValidator("json", querySchema), async (c) => {
  const { question, topK } = c.req.valid("json");

  // TODO: Llama a retrieveDocs()
  // TODO: Si no hay docs, devuelve { answer: 'No encontré documentos relevantes.' }
  // TODO: Construye el contexto: docs.map(d => `### ${d.title}\n${d.content}`).join('\n\n')
  // TODO: Llama al LLM con SYSTEM_PROMPT + contexto + question
  // TODO: Devuelve { answer, sources: docs.map(d => d.title) }
});

// ============================================
// POST /query/stream — streaming SSE
// ============================================

app.post("/query/stream", zValidator("json", querySchema), async (c) => {
  const { question, topK } = c.req.valid("json");

  // TODO: Llama a retrieveDocs()
  // TODO: Si no hay docs, devuelve { answer: 'No encontré documentos relevantes.' }
  // TODO: Construye el contexto
  // TODO: Llama al LLM con stream: true
  // TODO: Devuelve new Response(stream as ReadableStream, { headers: { 'Content-Type': 'text/event-stream', ... } })
});

export default app;
