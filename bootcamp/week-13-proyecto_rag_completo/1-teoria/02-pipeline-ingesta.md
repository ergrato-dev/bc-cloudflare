# 02 — Pipeline de Ingesta

## Objetivos

1. Subir el contenido de un documento a R2
2. Insertar metadata y contenido en D1
3. Generar el embedding del documento con Workers AI
4. Hacer upsert del vector en Vectorize

---

## 1. Crear el índice Vectorize

```bash
wrangler vectorize create rag-index --dimensions=768 --metric=cosine
wrangler d1 create rag-docs
wrangler d1 execute rag-docs --file=schema.sql
```

`@cf/baai/bge-base-en-v1.5` genera vectores de **768 dimensiones**.

---

## 2. Endpoint POST /documents

```typescript
type Bindings = {
  AI: Ai;
  DB: D1Database;
  BUCKET: R2Bucket;
  INDEX: VectorizeIndex;
};

const docSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(8000),
});

app.post('/documents', zValidator('json', docSchema), async (c) => {
  const { title, content } = c.req.valid('json');
  const docId = crypto.randomUUID();

  // 1. Guardar en R2
  await c.env.BUCKET.put(docId, content, {
    httpMetadata: { contentType: 'text/plain' },
  });

  // 2. Insertar en D1
  await c.env.DB.prepare(
    'INSERT INTO documents (id, title, content, r2_key) VALUES (?, ?, ?, ?)'
  ).bind(docId, title, content, docId).run();

  // 3. Generar embedding
  const embResult = await c.env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [content],
  });
  const embedding = (embResult as { data: number[][] }).data[0];

  // 4. Upsert a Vectorize
  await c.env.INDEX.upsert([{
    id: docId,
    values: embedding,
    metadata: { title, r2_key: docId },
  }]);

  return c.json({ id: docId, title, message: 'Documento indexado' }, 201);
});
```

---

## 3. Listar documentos

```typescript
app.get('/documents', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT id, title, created_at FROM documents ORDER BY created_at DESC LIMIT 50'
  ).all<{ id: string; title: string; created_at: string }>();
  return c.json(results);
});
```

---

## Checklist

- [ ] ¿Por qué usamos `crypto.randomUUID()` como ID del documento?
- [ ] ¿Qué pasa si el upsert a Vectorize falla después de insertar en D1?
- [ ] ¿El modelo `bge-base-en-v1.5` acepta un array o un string en `text`?
- [ ] ¿Qué campo de `embResult` contiene el array de flotantes?

## Referencias

- [Workers AI — bge-base-en-v1.5](https://developers.cloudflare.com/workers-ai/models/bge-base-en-v1.5/)
- [Vectorize — upsert](https://developers.cloudflare.com/vectorize/reference/client-api/)
