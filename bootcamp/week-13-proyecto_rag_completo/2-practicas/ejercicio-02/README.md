# Ejercicio 02 — Pipeline de Consulta y Streaming SSE

## Objetivo

Implementar los dos endpoints de consulta de un sistema RAG: `POST /query`
(respuesta completa) y `POST /query/stream` (respuesta en streaming SSE).

Este ejercicio usa los mismos recursos creados en el ejercicio anterior
(misma base D1, mismo índice Vectorize).

---

## Paso 1: Configurar wrangler.jsonc

Usa los mismos IDs de D1 y Vectorize del ejercicio anterior — solo cambia el
nombre del Worker y elimina R2 y el binding de escritura:

```jsonc
{
  "ai": { "binding": "AI" },
  "d1_databases": [{ "binding": "DB", "database_name": "rag-docs", "database_id": "TU_ID" }],
  "vectorize": [{ "binding": "INDEX", "index_name": "rag-index" }]
}
```

**Abre `starter/wrangler.jsonc`** y rellena los valores correctos.

---

## Paso 2: POST /query — respuesta completa

El endpoint ejecuta:

1. Embedea la pregunta con `@cf/baai/bge-base-en-v1.5`
2. Busca los `topK` vectores más similares en Vectorize
3. Recupera el contenido de esos documentos desde D1
4. Llama a `@cf/meta/llama-3.1-8b-instruct` con el contexto construido
5. Devuelve `{ answer, sources }` como JSON

**Abre `starter/src/index.ts`** y completa los TODOs del endpoint.

---

## Paso 3: POST /query/stream — respuesta SSE

Idéntico al paso 2 hasta el paso 4, pero:

```typescript
// En lugar de await AI.run(model, inputs):
const stream = await c.env.AI.run(model, { ...inputs, stream: true });

return new Response(stream as ReadableStream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  },
});
```

**Completa el TODO del POST /query/stream en el starter.**

---

## Verificación

Primero indexa documentos con el ejercicio anterior, luego:

```bash
cd starter && pnpm install && wrangler dev

# Consulta normal
curl -X POST http://localhost:8787/query \
  -H "Content-Type: application/json" \
  -d '{"question":"¿Qué es Workers KV?","topK":3}'

# Streaming SSE (observa los tokens llegando en tiempo real)
curl -N -X POST http://localhost:8787/query/stream \
  -H "Content-Type: application/json" \
  -d '{"question":"¿Cómo funciona el edge computing?"}'
```

La opción `-N` en curl desactiva el buffering y muestra los tokens del
stream en tiempo real.
