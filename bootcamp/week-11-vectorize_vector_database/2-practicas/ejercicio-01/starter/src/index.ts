import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con el binding VECTORIZE
// Hint: el tipo del binding Vectorize es `VectorizeIndex`
type Bindings = {
  // TODO: añadir VECTORIZE: VectorizeIndex
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

// Schema para un vector individual
const vectorSchema = z.object({
  id: z.string().min(1),
  values: z.array(z.number()).min(1),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

// Schema para la búsqueda por similitud
const searchSchema = z.object({
  vector: z.array(z.number()).min(1),
  topK: z.number().int().min(1).max(20).default(5),
  filter: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
});

// ============================================
// PASO 1: POST /vectors — upsert de vectores
// ============================================

app.post("/vectors", zValidator("json", z.array(vectorSchema)), async (c) => {
  const vectors = c.req.valid("json");

  // TODO: Llama a c.env.VECTORIZE.upsert(vectors) para insertar/actualizar
  // Hint: upsert devuelve un objeto con { mutationId: string }
  // TODO: Devuelve { mutationId, count: vectors.length } con status 201
});

// ============================================
// PASO 2: GET /vectors/:id — recuperar por ID
// ============================================

app.get("/vectors/:id", async (c) => {
  const id = c.req.param("id");

  // TODO: Llama a c.env.VECTORIZE.getByIds([id])
  // Hint: el resultado tiene la propiedad `vectors` (array)
  // TODO: Si vectors[0] no existe, devuelve 404 con { error: "not found" }
  // TODO: Devuelve vectors[0] como JSON
});

// ============================================
// PASO 3: POST /search — búsqueda por similitud
// ============================================

app.post("/search", zValidator("json", searchSchema), async (c) => {
  const { vector, topK, filter } = c.req.valid("json");

  // TODO: Llama a c.env.VECTORIZE.query(vector, { topK, returnMetadata: "all", filter })
  // Hint: el resultado tiene la propiedad `matches` (array de VectorizeMatch)
  // Cada match tiene: id, score, metadata
  // TODO: Devuelve result.matches como JSON
});

// ============================================
// PASO 4: DELETE /vectors/:id — eliminar vector
// ============================================

app.delete("/vectors/:id", async (c) => {
  const id = c.req.param("id");

  // TODO: Llama a c.env.VECTORIZE.deleteByIds([id])
  // TODO: Devuelve { deleted: id } con status 200
});

export default app;
