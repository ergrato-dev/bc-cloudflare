# Ejercicio 02 — Embeddings de texto y clasificación de imágenes

## Objetivo

Usar dos task types distintos del binding AI: generar embeddings numéricos de
frases de texto y clasificar el contenido de imágenes enviadas como binario.

---

## Paso 1: POST /embeddings — vector de texto

El modelo `@cf/baai/bge-base-en-v1.5` acepta `text` (string o array de strings)
y devuelve un array de vectores de 768 dimensiones en `result.data`.

```typescript
const result = await c.env.AI.run(
  "@cf/baai/bge-base-en-v1.5",
  { text: inputText }
);
// result.data[0] es el vector Float32[] del primer texto
```

**Abre `starter/src/index.ts`** y completa el TODO del POST /embeddings.

---

## Paso 2: POST /embeddings/similarity — similitud entre dos frases

Con batch podemos enviar dos frases y calcular su similitud coseno sin
hacer dos llamadas separadas al modelo.

```typescript
const { data } = await c.env.AI.run("@cf/baai/bge-base-en-v1.5", {
  text: [frase1, frase2],
});
const score = cosineSimilarity(data[0], data[1]);
```

La función `cosineSimilarity` ya está provista en el starter.
**Completa el TODO del POST /embeddings/similarity.**

---

## Paso 3: POST /classify — clasificar imagen

El modelo `@cf/microsoft/resnet-50` acepta los bytes de la imagen como
`number[]` (no `Uint8Array` directamente).

```typescript
const form = await c.req.formData();
const file = form.get("image") as File;
const bytes = await file.arrayBuffer();
const result = await c.env.AI.run(
  "@cf/microsoft/resnet-50",
  { image: [...new Uint8Array(bytes)] }
);
// result es un array [{ label: string, score: number }, ...]
```

**Completa el TODO del POST /classify en el starter.**

---

## Verificación

```bash
cd starter && pnpm install && wrangler dev

# Embeddings de una frase
curl -X POST http://localhost:8787/embeddings \
  -H "Content-Type: application/json" \
  -d '{"text": "Cloudflare Workers es serverless"}'

# Similitud entre dos frases
curl -X POST http://localhost:8787/embeddings/similarity \
  -H "Content-Type: application/json" \
  -d '{"text1": "El perro corre", "text2": "El can trota"}'

# Clasificar imagen (necesitas un archivo PNG/JPG)
curl -X POST http://localhost:8787/classify \
  -F "image=@/ruta/a/imagen.jpg"
```

Observa que frases similares producen un score de similitud > 0.8,
mientras que frases sin relación semántica producen valores < 0.3.
