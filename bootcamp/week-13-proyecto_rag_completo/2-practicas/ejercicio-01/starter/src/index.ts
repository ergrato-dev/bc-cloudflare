import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

type Bindings = {
  AI: Ai;
  DB: D1Database;
  BUCKET: R2Bucket;
  INDEX: VectorizeIndex;
};

type Document = {
  id: string;
  title: string;
  content: string;
  r2_key: string;
  created_at: string;
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

const docSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(8000),
});

// ============================================
// PASO 1: POST /documents — pipeline de ingesta
// ============================================

app.post("/documents", zValidator("json", docSchema), async (c) => {
  const { title, content } = c.req.valid("json");

  // TODO: Genera un ID único con crypto.randomUUID()
  // Hint: const docId = crypto.randomUUID();

  // TODO: Guarda el contenido en R2
  // Hint: await c.env.BUCKET.put(docId, content, { httpMetadata: { contentType: 'text/plain' } })

  // TODO: Inserta en D1 con prepared statement
  // Hint: INSERT INTO documents (id, title, content, r2_key) VALUES (?, ?, ?, ?)
  //       bind(docId, title, content, docId)

  // TODO: Genera el embedding con Workers AI
  // Hint: await c.env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [content] })
  //       El resultado tiene forma: { data: number[][] }
  //       El embedding es (embResult as { data: number[][] }).data[0]

  // TODO: Haz upsert del vector en Vectorize
  // Hint: await c.env.INDEX.upsert([{ id: docId, values: embedding, metadata: { title, r2_key: docId } }])

  // TODO: Devuelve { id: docId, title, message: 'Documento indexado' } con status 201
});

// ============================================
// GET /documents — listar documentos indexados
// ============================================

app.get("/documents", async (c) => {
  // TODO: Consulta D1 para listar los 50 documentos más recientes
  // Hint: SELECT id, title, created_at FROM documents ORDER BY created_at DESC LIMIT 50
  //       Usa .all<{ id: string; title: string; created_at: string }>()
  // TODO: Devuelve el array de resultados como JSON
});

export default app;
