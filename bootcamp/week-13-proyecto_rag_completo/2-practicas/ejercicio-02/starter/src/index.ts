import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  AI: Ai;
  DB: D1Database;
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

const querySchema = z.object({
  question: z.string().min(1).max(1000),
  topK: z.number().int().min(1).max(10).optional().default(3),
});

const SYSTEM_PROMPT =
  "Responde en español basándote ÚNICAMENTE en el contexto proporcionado. " +
  "Si la respuesta no está en el contexto, dilo claramente.";

// ============================================
// PASO 1: POST /query — respuesta completa JSON
// ============================================

app.post("/query", zValidator("json", querySchema), async (c) => {
  const { question, topK } = c.req.valid("json");

  // TODO: Embeba la pregunta con '@cf/baai/bge-base-en-v1.5'
  // Hint: await c.env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [question] })
  //       El vector es (embResult as { data: number[][] }).data[0]

  // TODO: Busca los topK vectores más similares en Vectorize
  // Hint: await c.env.INDEX.query(queryVector, { topK, returnMetadata: 'all' })
  //       Si matches.matches.length === 0, devuelve { answer: 'No encontré documentos relevantes.' }

  // TODO: Recupera los documentos desde D1
  // Hint: const ids = matches.matches.map(m => m.id)
  //       Construye placeholders con ids.map(() => '?').join(', ')
  //       SELECT id, title, content FROM documents WHERE id IN (${placeholders})
  //       Bind con .bind(...ids)

  // TODO: Construye el contexto concatenando título y contenido de cada doc
  // Hint: docs.map(d => `### ${d.title}\n${d.content}`).join('\n\n')

  // TODO: Llama al LLM con el contexto
  // Hint: await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', { messages: [...], max_tokens: 512 })
  //       El resultado tiene la forma: { response: string }

  // TODO: Devuelve { answer: result.response, sources: docs.map(d => d.title) }
});

// ============================================
// PASO 2: POST /query/stream — streaming SSE
// ============================================

app.post("/query/stream", zValidator("json", querySchema), async (c) => {
  const { question, topK } = c.req.valid("json");

  // TODO: Repite los mismos pasos de embed + Vectorize search + D1 fetch del endpoint anterior
  // (Puedes copiar y adaptar el código de /query)

  // TODO: Llama al LLM con stream: true
  // Hint: const stream = await c.env.AI.run(
  //         '@cf/meta/llama-3.1-8b-instruct',
  //         { messages: [...], max_tokens: 512, stream: true }
  //       )

  // TODO: Devuelve el stream directamente como Response
  // Hint: return new Response(stream as ReadableStream, {
  //         headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  //       })
});

export default app;
