# Ejercicio 02 — Búsqueda Semántica con Workers AI + Vectorize

## Objetivo

Implementar un Worker de búsqueda semántica que genera embeddings con Workers
AI (`@cf/baai/bge-base-en-v1.5`) y los almacena en Vectorize. Las búsquedas se
realizan por texto libre, no por vector manual.

---

## Paso 1: Bindings AI y VECTORIZE

Este Worker usa dos bindings simultáneamente:

```jsonc
{
  "ai": { "binding": "AI" },
  "vectorize": [{ "binding": "VECTORIZE", "index_name": "docs-index" }]
}
```

```typescript
type Bindings = {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
};
```

**Abre `starter/src/index.ts`** y completa el TODO del tipo `Bindings`.

---

## Paso 2: Helper getEmbedding()

La función auxiliar genera el embedding de un texto usando Workers AI:

```typescript
async function getEmbedding(ai: Ai, text: string): Promise<number[]> {
  const result = await ai.run("@cf/baai/bge-base-en-v1.5", { text: [text] });
  return result.data[0];
}
```

**Completa el TODO de `getEmbedding` en el starter.**

---

## Paso 3: POST /documents — indexar documento

El endpoint recibe `{ id, text, metadata }`, genera el embedding y lo guarda:

```typescript
const values = await getEmbedding(c.env.AI, text);
await c.env.VECTORIZE.upsert([{ id, values, metadata }]);
```

**Completa el TODO del POST /documents en el starter.**

---

## Paso 4: POST /search — búsqueda semántica por texto

Recibe `{ query, topK }` (texto libre), genera el embedding de la query y
llama a Vectorize para obtener los documentos más similares:

```typescript
const queryVector = await getEmbedding(c.env.AI, query);
const result = await c.env.VECTORIZE.query(queryVector, {
  topK,
  returnMetadata: "all",
});
```

**Completa el TODO del POST /search en el starter.**

---

## Verificación

```bash
cd starter && pnpm install && wrangler dev

# Indexar 3 documentos
curl -X POST http://localhost:8787/documents \
  -H "Content-Type: application/json" \
  -d '{"id":"d1","text":"Workers KV es un almacén clave-valor global","metadata":{"topic":"kv"}}'

curl -X POST http://localhost:8787/documents \
  -H "Content-Type: application/json" \
  -d '{"id":"d2","text":"D1 es una base de datos SQLite en el edge","metadata":{"topic":"d1"}}'

curl -X POST http://localhost:8787/documents \
  -H "Content-Type: application/json" \
  -d '{"id":"d3","text":"R2 almacena objetos y archivos de gran tamaño","metadata":{"topic":"r2"}}'

# Buscar por texto libre — debería devolver d2 con score alto
curl -X POST http://localhost:8787/search \
  -H "Content-Type: application/json" \
  -d '{"query":"base de datos relacional en Cloudflare","topK":3}'
```

Observa que la búsqueda por "base de datos relacional" encuentra "D1 SQLite"
aunque las palabras exactas no coincidan — esto es la búsqueda semántica.
