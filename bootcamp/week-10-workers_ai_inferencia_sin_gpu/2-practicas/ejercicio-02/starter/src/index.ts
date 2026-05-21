import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  AI: Ai;
};

// ============================================
// UTILIDADES
// ============================================

// Calcula la similitud coseno entre dos vectores (rango -1 a 1)
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// Schema para el endpoint de embeddings
const embeddingSchema = z.object({
  text: z.string().min(1).max(512),
});

// Schema para similitud entre dos textos
const similaritySchema = z.object({
  text1: z.string().min(1).max(512),
  text2: z.string().min(1).max(512),
});

// ============================================
// PASO 1: POST /embeddings — vector de una frase
// ============================================

app.post("/embeddings", zValidator("json", embeddingSchema), async (c) => {
  const { text } = c.req.valid("json");

  // TODO: Llama a c.env.AI.run() con el modelo "@cf/baai/bge-base-en-v1.5"
  // Inputs: { text }
  // Hint: el resultado tiene la propiedad `data` que es un array de vectores
  //       result.data[0] es el vector Float32[] de la primera (y única) frase
  // TODO: Devuelve { vector: result.data[0], dimensions: result.data[0].length }
});

// ============================================
// PASO 2: POST /embeddings/similarity — similitud coseno entre dos frases
// ============================================

app.post(
  "/embeddings/similarity",
  zValidator("json", similaritySchema),
  async (c) => {
    const { text1, text2 } = c.req.valid("json");

    // TODO: Llama a AI.run() con { text: [text1, text2] } para obtener ambos vectores
    //       en una sola llamada (batch)
    // Hint: result.data[0] es el vector de text1, result.data[1] el de text2
    // TODO: Calcula la similitud coseno usando la función cosineSimilarity()
    // TODO: Devuelve { text1, text2, similarity: score (redondeado a 4 decimales) }
  }
);

// ============================================
// PASO 3: POST /classify — clasificar imagen
// ============================================

app.post("/classify", async (c) => {
  // TODO: Obtén el FormData de la request con c.req.formData()
  // TODO: Obtén el campo "image" como File: form.get("image") as File
  // TODO: Si no hay imagen, devuelve 400 con { error: "Campo image requerido" }
  // TODO: Convierte a ArrayBuffer con file.arrayBuffer()
  // TODO: Llama a AI.run() con "@cf/microsoft/resnet-50" y
  //       { image: [...new Uint8Array(bytes)] }
  // Hint: el resultado es un array [{ label: string, score: number }, ...]
  //       ordenado de mayor a menor score
  // TODO: Devuelve las 5 primeras predicciones como JSON
});

export default app;
