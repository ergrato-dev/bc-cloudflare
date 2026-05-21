# Glosario — Semana 10: Workers AI

> **Workers AI: Inferencia sin GPU propia**

Términos clave introducidos esta semana, ordenados alfabéticamente.

---

## A

**Ai (tipo TypeScript)**
Tipo nativo de `@cloudflare/workers-types` que representa el binding AI en un
Worker. Se declara en `Bindings` como `AI: Ai` y expone el método `run()`.

**AI binding**
Mecanismo declarado en `wrangler.jsonc` bajo la clave `"ai"` que otorga al
Worker acceso al runtime de inferencia de Cloudflare. No requiere ID ni
credenciales externas.

**Automatic Speech Recognition (ASR)**
Tarea de ML que convierte audio hablado en texto. En Workers AI se realiza con
el modelo `@cf/openai/whisper`.

## C

**cosine similarity**
Métrica que mide el ángulo entre dos vectores en el espacio de embeddings.
Rango de -1 (opuestos) a 1 (idénticos). Valor > 0.8 indica alta similitud
semántica entre dos textos.

## E

**embedding**
Vector numérico de alta dimensión que representa el significado semántico de
un texto. Textos con significado similar producen vectores cercanos entre sí.
El modelo `@cf/baai/bge-base-en-v1.5` genera vectores de 768 dimensiones.

## G

**GPU PoP**
Punto de Presencia de Cloudflare equipado con GPUs dedicadas para inferencia.
Workers AI enruta la llamada al PoP GPU más cercano al Worker invocado.

## I

**inference**
Proceso de ejecutar un modelo de ML con datos de entrada para obtener una
predicción o respuesta. En Workers AI ocurre en GPUs de Cloudflare sin que el
developer gestione hardware.

## L

**LLM (Large Language Model)**
Modelo de lenguaje de gran escala entrenado para generar texto coherente.
En Workers AI, `@cf/meta/llama-3.1-8b-instruct` es el LLM principal.

## R

**ReadableStream**
API Web estándar que representa una secuencia de datos que puede leerse de
forma incremental. Workers AI con `stream: true` devuelve un `ReadableStream`
con fragmentos SSE.

## S

**Server-Sent Events (SSE)**
Protocolo unidireccional sobre HTTP donde el servidor envía eventos al cliente
de forma incremental. Formato: `data: {...}\n\n`. Usado para streaming de
tokens de LLM en Workers AI.

**system prompt**
Mensaje con rol `"system"` en el array `messages` que define el comportamiento,
personalidad y restricciones del asistente LLM. Se envía en cada invocación.

## T

**task type**
Categoría de tarea ML que determina el formato de entrada y salida de un
modelo en Workers AI. Ejemplos: `text-generation`, `text-embeddings`,
`text-to-image`, `automatic-speech-recognition`.

**text-to-image**
Tarea ML que genera una imagen PNG a partir de un prompt de texto.
En Workers AI: `@cf/stabilityai/stable-diffusion-xl-base-1.0`.

**TTFT (Time to First Token)**
Métrica de latencia que mide el tiempo desde que se envía la request hasta
que llega el primer token del LLM. Clave para la experiencia de usuario en
aplicaciones de chat con streaming.
