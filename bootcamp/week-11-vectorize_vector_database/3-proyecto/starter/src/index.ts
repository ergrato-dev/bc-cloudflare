// ============================================
// PROYECTO SEMANAL: Motor de Búsqueda Semántica
// Semana 11 — Vectorize: Vector Database en el Edge
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → indexa enfermedades y tratamientos
//   Escape room         → indexa pistas y descripciones de salas
//   Marina deportiva    → indexa maniobras y reglas de regata
//
// ANTES de ejecutar:
//   1. Crea el índice Vectorize:
//      wrangler vectorize create domain-index --dimensions=768 --metric=cosine
//   2. Ajusta el nombre del índice en wrangler.jsonc si lo cambias

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS — adapta los campos de metadata a tu dominio
// ============================================

type Bindings = {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
};

// TODO: Ajusta los campos de metadata al modelo de tu dominio
// Ejemplos:
//   Veterinaria: { species: string; severity: string }
//   Escape room: { room: string; difficulty: string }
type DocumentMetadata = Record<string, string | number | boolean>;

// ============================================
// HELPER — genera embedding de 768 dimensiones
// ============================================

// Convierte texto a vector usando el modelo bge-base
async function getEmbedding(ai: Ai, text: string): Promise<number[]> {
  const result = await ai.run("@cf/baai/bge-base-en-v1.5", { text: [text] });
  return result.data[0];
}

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// TODO: Ajusta el schema de metadata al modelo de tu dominio
const documentSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1).max(2000),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

const searchSchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().int().min(1).max(20).default(5),
  // TODO: añade campos de filter relevantes a tu dominio si lo necesitas
});

// ============================================
// TODO: POST /documents — indexar documento del dominio
// ============================================

// TODO: Implementa el endpoint de indexación
// Pasos:
//   1. Extrae { id, text, metadata } del body validado
//   2. Genera el embedding con getEmbedding(c.env.AI, text)
//   3. Inserta en Vectorize con upsert([{ id, values, metadata }])
//   4. Devuelve { id, dims: values.length } con status 201
app.post("/documents", zValidator("json", documentSchema), async (_c) => {
  // TODO: implementar
});

// ============================================
// TODO: POST /search — búsqueda semántica por texto libre
// ============================================

// TODO: Implementa la búsqueda semántica
// Pasos:
//   1. Extrae { query, topK } del body validado
//   2. Genera el embedding de la query con getEmbedding
//   3. Llama a VECTORIZE.query(queryVector, { topK, returnMetadata: "all" })
//   4. Devuelve result.matches como JSON
app.post("/search", zValidator("json", searchSchema), async (_c) => {
  // TODO: implementar
});

// ============================================
// TODO: GET /documents/:id — recuperar documento (avanzado)
// ============================================

// TODO: Implementa la recuperación por ID
// Hint: usa c.env.VECTORIZE.getByIds([id])

// ============================================
// TODO: DELETE /documents/:id — eliminar documento (avanzado)
// ============================================

// TODO: Implementa la eliminación por ID
// Hint: usa c.env.VECTORIZE.deleteByIds([id])

export default app;
