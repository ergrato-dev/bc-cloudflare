import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con AI y VECTORIZE
// Hint: AI es `Ai` y VECTORIZE es `VectorizeIndex`
type Bindings = {
  // TODO: añadir AI: Ai
  // TODO: añadir VECTORIZE: VectorizeIndex
};

// ============================================
// HELPER
// ============================================

// TODO: Implementa getEmbedding(ai, text) -> Promise<number[]>
// Pasos:
//   1. Llama a ai.run("@cf/baai/bge-base-en-v1.5", { text: [text] })
//   2. Devuelve result.data[0] (array de 768 floats)
async function getEmbedding(_ai: Ai, _text: string): Promise<number[]> {
  // TODO: implementar
  return [];
}

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// Schema para indexar un documento
const indexSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(2000),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

// Schema para la búsqueda semántica
const searchSchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().int().min(1).max(20).default(5),
});

// ============================================
// PASO 1: POST /documents — indexar documento
// ============================================

app.post("/documents", zValidator("json", indexSchema), async (c) => {
  const { id, text, metadata } = c.req.valid("json");

  // TODO: Genera el embedding del texto con getEmbedding(c.env.AI, text)
  // TODO: Llama a c.env.VECTORIZE.upsert([{ id, values, metadata }])
  // TODO: Devuelve { id, dims: values.length } con status 201
});

// ============================================
// PASO 2: POST /search — búsqueda semántica
// ============================================

app.post("/search", zValidator("json", searchSchema), async (c) => {
  const { query, topK } = c.req.valid("json");

  // TODO: Genera el embedding de la query con getEmbedding(c.env.AI, query)
  // TODO: Llama a c.env.VECTORIZE.query(queryVector, { topK, returnMetadata: "all" })
  // TODO: Devuelve result.matches como JSON
});

export default app;
