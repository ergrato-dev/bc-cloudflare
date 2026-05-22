import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// ============================================
// TIPOS
// ============================================

// TODO: Define el tipo Bindings con CF_ACCOUNT_ID, GATEWAY_ID,
//       OPENAI_API_KEY y CF_API_TOKEN (todos `string`)
type Bindings = {
  // TODO
};

// ============================================
// APP
// ============================================

const app = new Hono<{ Bindings: Bindings }>();

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
});

// ============================================
// PASO 1: POST /chat/openai — proveedor externo
// ============================================

app.post("/chat/openai", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Construye la URL base del gateway:
  //   `https://gateway.ai.cloudflare.com/v1/${c.env.CF_ACCOUNT_ID}/${c.env.GATEWAY_ID}`
  // TODO: Llama con fetch al endpoint de OpenAI:
  //   `${gatewayBase}/openai/chat/completions`
  //   method: "POST"
  //   headers: Content-Type, Authorization, "cf-aig-cache-ttl": "1800"
  //   body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: message }], max_tokens: 512 })
  // Hint: si la respuesta no es ok, lanza un error con await response.text()
  // TODO: Parsea el body como JSON y devuelve { reply: data.choices[0].message.content }
});

// ============================================
// PASO 2: POST /chat/fallback — endpoint universal
// ============================================

app.post("/chat/fallback", zValidator("json", chatSchema), async (c) => {
  const { message } = c.req.valid("json");

  // TODO: Construye la URL base del gateway (misma que arriba)
  // TODO: Define el array de proveedores para el endpoint universal:
  //   - Proveedor 1 (primario): openai, endpoint: "chat/completions",
  //     headers: { Authorization: `Bearer ${c.env.OPENAI_API_KEY}` },
  //     query: { model: "gpt-4o-mini", messages: [...], max_tokens: 512 }
  //   - Proveedor 2 (fallback): workers-ai, endpoint: "@cf/meta/llama-3.1-8b-instruct",
  //     headers: { Authorization: `Bearer ${c.env.CF_API_TOKEN}` },
  //     query: { messages: [...], max_tokens: 512 }
  // TODO: Llama con fetch a `gatewayBase` con body: JSON.stringify(providers)
  // TODO: Parsea la respuesta y devuelve el texto generado como { reply: ... }
  // Hint: el formato de respuesta varía por proveedor — para Workers AI usa `.response`
});

export default app;
