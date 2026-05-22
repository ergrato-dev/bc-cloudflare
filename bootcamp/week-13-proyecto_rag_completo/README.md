# Semana 13 — Proyecto RAG Completo

> **Etapa 2 — AI en el Edge** · Bootcamp Cloudflare De Cero a Héroe

---

## 🎯 Objetivos

1. Comprender el pipeline RAG completo: ingest → embed → store → query → generate
2. Implementar la ingesta de documentos en R2, D1 y Vectorize desde un Worker
3. Consultar por similitud semántica y generar respuestas contextualizadas con un LLM
4. Transmitir respuestas del LLM en tiempo real usando Server-Sent Events (SSE)

---

## ⏱️ Distribución del tiempo (8h)

| Bloque | Actividad | Horas |
|--------|-----------|-------|
| Teoría | RAG, pipelines, SSE | 2.0h |
| Práctica | Ingesta + consulta guiadas | 3.0h |
| Proyecto | Sistema RAG de tu dominio | 2.5h |
| Recursos | Revisión y referencias | 0.5h |

---

## 🗂️ Contenido

| # | Archivo | Tema |
|---|---------|------|
| 01 | [RAG — Arquitectura](1-teoria/01-rag-arquitectura.md) | Qué es RAG, componentes, schema D1 |
| 02 | [Pipeline de Ingesta](1-teoria/02-pipeline-ingesta.md) | R2 + D1 + embed + Vectorize upsert |
| 03 | [Pipeline de Consulta](1-teoria/03-pipeline-consulta.md) | Embed query, Vectorize search, LLM con contexto |
| 04 | [Streaming SSE](1-teoria/04-streaming-sse.md) | `stream: true`, ReadableStream, EventSource |

---

## ✅ Checklist de Entrega

- [ ] ¿El Worker indexa documentos en D1, R2 y Vectorize correctamente?
- [ ] ¿La búsqueda semántica devuelve documentos relevantes con `topK`?
- [ ] ¿El endpoint de streaming devuelve `Content-Type: text/event-stream`?
- [ ] ¿El proyecto está adaptado a tu dominio y deployado en producción?

---

## 🔗 Navegación

← [Semana 12 — AI Gateway](../week-12-ai_gateway_proxy_inteligente/README.md) &nbsp;|&nbsp;
→ [Semana 14 — Cloudflare Agents](../week-14-cloudflare_agents/README.md)
