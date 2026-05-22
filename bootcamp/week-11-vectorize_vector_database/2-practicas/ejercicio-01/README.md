# Ejercicio 01 — Índice Vectorize y Operaciones CRUD

## Objetivo

Implementar un Worker que gestiona un índice Vectorize: insertar vectores con
metadata, recuperarlos por ID, buscar por similitud y eliminarlos.

---

## Paso 1: Crear el índice y declarar el binding

Antes de ejecutar el Worker, crea el índice desde la terminal:

```bash
wrangler vectorize create knowledge-base --dimensions=768 --metric=cosine
```

El binding en `wrangler.jsonc` ya está declarado:

```jsonc
{
  "vectorize": [
    { "binding": "VECTORIZE", "index_name": "knowledge-base" }
  ]
}
```

**Abre `starter/wrangler.jsonc`** y verifica la configuración.

---

## Paso 2: Tipo Bindings con `VectorizeIndex`

```typescript
type Bindings = {
  VECTORIZE: VectorizeIndex; // tipo nativo de @cloudflare/workers-types
};
```

**Abre `starter/src/index.ts`** y completa el TODO del tipo `Bindings`.

---

## Paso 3: POST /vectors — upsert de vectores

El endpoint recibe un array de vectores y los inserta/actualiza en el índice.
Usa `upsert` para que las llamadas repetidas no fallen.

```typescript
const result = await c.env.VECTORIZE.upsert(vectors);
// result.mutationId identifica la operación de escritura
```

**Completa el TODO del POST /vectors en el starter.**

---

## Paso 4: GET /vectors/:id — recuperar por ID

```typescript
const result = await c.env.VECTORIZE.getByIds([id]);
// result.vectors[0] contiene el vector con metadata
```

**Completa el TODO del GET /vectors/:id en el starter.**

---

## Paso 5: POST /search — búsqueda por similitud

Recibe un vector de consulta y devuelve los `topK` más similares:

```typescript
const result = await c.env.VECTORIZE.query(queryVector, {
  topK: 5,
  returnMetadata: "all",
});
// result.matches es el array de resultados con score
```

**Completa el TODO del POST /search en el starter.**

---

## Paso 6: DELETE /vectors/:id — eliminar vector

```typescript
await c.env.VECTORIZE.deleteByIds([id]);
```

**Completa el TODO del DELETE /vectors/:id en el starter.**

---

## Verificación

```bash
cd starter && pnpm install && wrangler dev

# Insertar vectores de prueba (dimensiones reducidas a 3 para el ejemplo)
curl -X POST http://localhost:8787/vectors \
  -H "Content-Type: application/json" \
  -d '[{"id":"v1","values":[0.1,0.2,0.3],"metadata":{"label":"perro"}},{"id":"v2","values":[0.4,0.5,0.6],"metadata":{"label":"gato"}}]'

# Recuperar por ID
curl http://localhost:8787/vectors/v1

# Buscar similares
curl -X POST http://localhost:8787/search \
  -H "Content-Type: application/json" \
  -d '{"vector":[0.1,0.21,0.31],"topK":2}'

# Eliminar
curl -X DELETE http://localhost:8787/vectors/v1
```

> **Nota**: En este ejercicio usamos vectores de 3 dimensiones para facilitar
> las pruebas manuales. En producción usa siempre 768 con el modelo bge-base.
