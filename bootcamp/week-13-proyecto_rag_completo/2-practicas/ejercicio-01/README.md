# Ejercicio 01 — Pipeline de Ingesta

## Objetivo

Implementar el pipeline de ingesta de un sistema RAG: cada documento que llega
al Worker se guarda en R2, se indexa en D1 y se vectoriza en Vectorize.

---

## Paso 1: Preparar recursos

```bash
# Crea el índice Vectorize (768 dims = bge-base-en-v1.5)
wrangler vectorize create rag-index --dimensions=768 --metric=cosine

# Crea la base D1
wrangler d1 create rag-docs

# Aplica el schema
wrangler d1 execute rag-docs --file=schema.sql

# Crea el bucket R2
wrangler r2 bucket create rag-documents
```

Copia los IDs generados en `wrangler.jsonc`.

---

## Paso 2: Bindings en wrangler.jsonc

```jsonc
{
  "ai": { "binding": "AI" },
  "d1_databases": [{ "binding": "DB", "database_name": "rag-docs", "database_id": "TU_ID" }],
  "r2_buckets": [{ "binding": "BUCKET", "bucket_name": "rag-documents" }],
  "vectorize": [{ "binding": "INDEX", "index_name": "rag-index" }]
}
```

**Abre `starter/wrangler.jsonc`** y reemplaza `"TU_DATABASE_ID"` y
`"TU_BUCKET_NAME"` con los valores reales.

---

## Paso 3: POST /documents

El endpoint debe, en orden:

1. Generar un `crypto.randomUUID()` como ID del documento
2. Guardar el contenido en R2 con `BUCKET.put(id, content, ...)`
3. Insertar metadata y contenido en D1 con un prepared statement
4. Embedear el contenido con `AI.run('@cf/baai/bge-base-en-v1.5', { text: [content] })`
5. Hacer upsert del vector en Vectorize

**Abre `starter/src/index.ts`** y completa los TODOs del endpoint.

---

## Paso 4: Verificación

```bash
cd starter && pnpm install && wrangler dev

# Indexar un documento
curl -X POST http://localhost:8787/documents \
  -H "Content-Type: application/json" \
  -d '{"title":"Workers KV","content":"Workers KV es un almacén clave-valor distribuido en el edge de Cloudflare. Es eventualmente consistente y tiene lecturas de baja latencia."}'

# Listar documentos
curl http://localhost:8787/documents
```

Comprueba también en wrangler dev que D1 y Vectorize recibieron el documento:
```bash
wrangler d1 execute rag-docs --command "SELECT id, title FROM documents"
```
