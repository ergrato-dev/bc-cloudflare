# Glosario — Semana 13: Proyecto RAG Completo

Términos clave de la semana, ordenados alfabéticamente.

---

## C

### Chunking
División de documentos largos en fragmentos más pequeños antes de
embedearlos. Documentos muy largos superan el límite de tokens de los
modelos de embedding; los chunks de 256–512 tokens dan mejor recall.

### Contexto (RAG)
El conjunto de fragmentos de texto recuperados por Vectorize que se pasan
al LLM como parte del prompt. Define la "ventana de conocimiento" que el
modelo usa para responder.

---

## E

### Embedding
Vector numérico de longitud fija que representa el significado semántico
de un texto. Textos similares tienen embeddings con alta similitud coseno.
En este bootcamp: `@cf/baai/bge-base-en-v1.5` genera embeddings de 768 dims.

---

## G

### Generación Aumentada por Recuperación
Ver RAG.

---

## H

### Hallucination
Error de un LLM que genera información falsa pero plausible. RAG reduce
las alucinaciones al anclar las respuestas a documentos reales recuperados.

---

## P

### Pipeline de Consulta
Secuencia: embed pregunta → buscar Vectorize → fetch D1 → construir contexto
→ llamar LLM → devolver respuesta. Se ejecuta por cada pregunta del usuario.

### Pipeline de Ingesta
Secuencia: recibir documento → subir a R2 → insertar en D1 → embedear con
Workers AI → upsert en Vectorize. Se ejecuta una vez por documento.

---

## R

### RAG (Retrieval-Augmented Generation)
Patrón de IA que combina búsqueda de información relevante (retrieval) con
generación de texto (generation). El LLM responde basado en documentos
recuperados, no solo en su conocimiento entrenado.

### ReadableStream
API web que representa un flujo de datos legible. Workers AI con
`stream: true` devuelve un `ReadableStream<Uint8Array>` que se puede
pasar directamente como `Response` body.

---

## S

### Server-Sent Events (SSE)
Protocolo HTTP donde el servidor envía múltiples mensajes sobre una
conexión HTTP larga. Formato: `data: {json}\n\n`. Headers requeridos:
`Content-Type: text/event-stream`.

### Similitud Coseno
Métrica de distancia entre dos vectores. Valor entre -1 y 1: 1 = idénticos,
0 = sin relación, -1 = opuestos. Usada por Vectorize para rankear resultados.

---

## T

### `topK`
Parámetro de `VectorizeIndex.query()` que define cuántos vectores más
similares devolver. Valores típicos: 3–5 para RAG (más contexto = más
tokens = más coste de inferencia).

---

## V

### `VectorizeIndex`
Binding de Cloudflare Workers que provee acceso a un índice vectorial.
Métodos clave: `upsert()`, `query()`, `deleteByIds()`, `getByIds()`.
