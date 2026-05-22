# 04 — Streaming SSE

## Objetivos

1. Entender cómo funciona Server-Sent Events (SSE)
2. Activar el streaming en Workers AI con `stream: true`
3. Devolver un `ReadableStream` directamente como respuesta HTTP
4. Leer el stream desde el cliente con `EventSource`

---

## 1. ¿Qué es SSE?

SSE (Server-Sent Events) es un protocolo HTTP estándar donde el servidor
envía datos en fragmentos sobre una conexión larga abierta.

| Característica | SSE | WebSocket |
|----------------|-----|-----------|
| Dirección | Servidor → Cliente | Bidireccional |
| Protocolo | HTTP/1.1 | WS |
| Reconexión | Automática | Manual |
| Uso típico | Streaming de texto, noticias | Chat en tiempo real |

SSE es ideal para streaming de respuestas LLM — el cliente recibe tokens
mientras el modelo los genera.

---

## 2. `stream: true` en Workers AI

Pasa `stream: true` como campo del input. Workers AI devuelve un
`ReadableStream<Uint8Array>` ya formateado como SSE (líneas `data: ...`).

```typescript
const stream = await c.env.AI.run(
  '@cf/meta/llama-3.1-8b-instruct',
  {
    messages: [{ role: 'user', content: question }],
    max_tokens: 512,
    stream: true,
  }
);
```

---

## 3. Devolver el stream como respuesta

```typescript
app.post('/query/stream', zValidator('json', querySchema), async (c) => {
  const { question } = c.req.valid('json');

  // ... embed + Vectorize search + D1 fetch (igual que /query) ...

  const stream = await c.env.AI.run(
    '@cf/meta/llama-3.1-8b-instruct',
    {
      messages: [
        { role: 'system', content: 'Responde en español basándote en el contexto.' },
        { role: 'user', content: `Contexto:\n${context}\n\nPregunta: ${question}` },
      ],
      max_tokens: 512,
      stream: true,
    }
  );

  return new Response(stream as ReadableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
});
```

---

## 4. Consumir el stream desde el cliente

```javascript
const es = new EventSource('/query/stream?q=...');
// O con fetch + body:
const response = await fetch('/query/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question }),
});
const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}
```

> Cada línea del stream tiene formato `data: {"response":"token"}\n\n`.
> La última línea es `data: [DONE]\n\n`.

---

## Checklist

- [ ] ¿Qué `Content-Type` se requiere para SSE?
- [ ] ¿Por qué Workers AI ya formatea el stream como SSE directamente?
- [ ] ¿Qué ocurre si omites `stream: true` pero devuelves un `ReadableStream`?
- [ ] ¿Cómo decodifica el cliente los fragmentos binarios del stream?

## Referencias

- [Workers AI — Streaming](https://developers.cloudflare.com/workers-ai/configuration/streaming/)
- [MDN — Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
