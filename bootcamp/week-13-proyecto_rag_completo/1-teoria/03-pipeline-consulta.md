# 03 — Pipeline de Consulta

## Objetivos

1. Embedear la pregunta del usuario con el mismo modelo que los documentos
2. Buscar los documentos más similares en Vectorize
3. Recuperar el contenido desde D1 y construir el contexto para el LLM
4. Generar la respuesta con el LLM usando el contexto recuperado

---

## 1. Flujo completo

```
pregunta → embed (bge) → query Vectorize (topK=5) → fetch D1 → contexto → llama → respuesta
```

El LLM **no genera desde memoria** — responde basándose en los fragmentos
recuperados. Por eso, la calidad del RAG depende de la relevancia de los
documentos indexados.

---

## 2. Endpoint POST /query

```typescript
const querySchema = z.object({
  question: z.string().min(1).max(1000),
  topK: z.number().int().min(1).max(10).optional().default(3),
});

app.post('/query', zValidator('json', querySchema), async (c) => {
  const { question, topK } = c.req.valid('json');

  // 1. Embed la pregunta
  const embResult = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [question],
  });
  const queryVector = (embResult as { data: number[][] }).data[0];

  // 2. Buscar en Vectorize
  const matches = await c.env.INDEX.query(queryVector, {
    topK,
    returnMetadata: 'all',
  });

  if (matches.matches.length === 0) {
    return c.json({ answer: 'No encontré documentos relevantes.' });
  }

  // 3. Recuperar contenido desde D1
  const ids = matches.matches.map(m => m.id);
  const placeholders = ids.map(() => '?').join(', ');
  const { results: docs } = await c.env.DB.prepare(
    `SELECT id, title, content FROM documents WHERE id IN (${placeholders})`
  ).bind(...ids).all<{ id: string; title: string; content: string }>();

  // 4. Construir contexto
  const context = docs
    .map(d => `### ${d.title}\n${d.content}`)
    .join('\n\n');

  // 5. LLM con contexto
  const result = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
    messages: [
      {
        role: 'system',
        content:
          'Responde en español basándote ÚNICAMENTE en el contexto. ' +
          'Si la respuesta no está en el contexto, dilo claramente.',
      },
      { role: 'user', content: `Contexto:\n${context}\n\nPregunta: ${question}` },
    ],
    max_tokens: 512,
  });

  return c.json({
    answer: (result as { response: string }).response,
    sources: docs.map(d => d.title),
  });
});
```

---

## Checklist

- [ ] ¿Por qué embebemos la pregunta con el mismo modelo que los documentos?
- [ ] ¿Qué ajusta el parámetro `topK` y cuál es el tradeoff?
- [ ] ¿Por qué el system prompt limita las respuestas al contexto?
- [ ] ¿Los IDs en `matches.matches` son seguros para usar en un IN clause de D1?

## Referencias

- [Vectorize — query()](https://developers.cloudflare.com/vectorize/reference/client-api/)
- [Workers AI — llama-3.1-8b-instruct](https://developers.cloudflare.com/workers-ai/models/llama-3.1-8b-instruct/)
