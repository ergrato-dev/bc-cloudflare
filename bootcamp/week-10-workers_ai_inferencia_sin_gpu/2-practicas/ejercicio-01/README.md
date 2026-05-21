# Ejercicio 01 — Chatbot API con LLM y Streaming SSE

## Objetivo

Implementar una API de chatbot que usa `@cf/meta/llama-3.1-8b-instruct` para
responder preguntas. Expondrás dos endpoints: uno con respuesta completa JSON y
otro con tokens en streaming usando Server-Sent Events.

---

## Paso 1: Binding AI en wrangler.jsonc

El binding `AI` no requiere ID externo: Cloudflare lo activa automáticamente
cuando se declara en `wrangler.jsonc`.

```jsonc
{
  "ai": {
    "binding": "AI"
  }
}
```

**Abre `starter/wrangler.jsonc`** y verifica que el binding está declarado.

---

## Paso 2: Tipo Bindings con `AI: Ai`

```typescript
type Bindings = {
  AI: Ai; // tipo nativo de @cloudflare/workers-types
};
```

**Abre `starter/src/index.ts`** y completa el TODO del tipo `Bindings`.

---

## Paso 3: POST /chat — respuesta completa

El modelo recibe un array `messages` con roles `system` y `user`.
La respuesta completa tiene la propiedad `response` con el texto generado.

```typescript
const result = await c.env.AI.run(
  "@cf/meta/llama-3.1-8b-instruct",
  {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 512,
  }
);
```

**Completa el TODO del POST /chat en el starter.**

---

## Paso 4: POST /chat/stream — tokens progresivos

Con `stream: true` el modelo devuelve un `ReadableStream`.
Sirve el stream directamente con el `Content-Type` correcto.

```typescript
const stream = await c.env.AI.run(
  "@cf/meta/llama-3.1-8b-instruct",
  { messages, stream: true }
);
return new Response(stream as ReadableStream, {
  headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
});
```

**Completa el TODO del POST /chat/stream en el starter.**

---

## Verificación

```bash
cd starter && pnpm install && wrangler dev

# Respuesta completa
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "¿Qué es Cloudflare Workers?"}'

# Streaming (verás tokens llegar progresivamente)
curl -X POST http://localhost:8787/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "Explica qué es un V8 isolate en 3 oraciones"}'
```

Compara la respuesta de `/chat` (espera hasta el final) vs `/chat/stream`
(tokens progresivos) — observa la diferencia en tiempo de respuesta percibido.
