# Semana 10 — Workers AI: Inferencia sin GPU propia

> **Etapa 2 — AI en el Edge** · Bootcamp Cloudflare De Cero a Héroe

---

## 🎯 Objetivos

- Ejecutar inferencia de LLM, embeddings, imagen y audio desde un Worker
- Configurar el binding `AI` y llamar modelos con tipos seguros
- Implementar respuestas en streaming con SSE usando Hono
- Generar embeddings de texto para búsqueda semántica

---

## ⏱️ Distribución del tiempo (8h)

| Bloque | Actividad | Horas |
|--------|-----------|-------|
| Teoría | Binding AI, LLM, embeddings, multimodal | 2.0h |
| Práctica | Ejercicios guiados (chatbot + embeddings) | 3.0h |
| Proyecto | Asistente AI para el dominio asignado | 2.5h |
| Recursos | Revisión y referencias | 0.5h |

---

## 🗂️ Contenido

| # | Archivo | Tema |
|---|---------|------|
| 01 | [Introducción a Workers AI](1-teoria/01-workers-ai-intro.md) | Arquitectura, binding, catálogo de modelos |
| 02 | [Generación de texto y streaming](1-teoria/02-text-generation-streaming.md) | LLM, SSE, parámetros |
| 03 | [Embeddings de texto](1-teoria/03-embeddings.md) | bge-base, similitud coseno |
| 04 | [Visión y voz](1-teoria/04-vision-y-speech.md) | Image gen, clasificación, Whisper |

---

## 🗂️ Navegación

- [📖 Teoría](1-teoria/)
- [💻 Prácticas](2-practicas/)
- [📦 Proyecto](3-proyecto/)
- [📚 Recursos](4-recursos/)
- [📝 Glosario](5-glosario/)
- [📊 Rúbrica](rubrica-evaluacion.md)

---

## ✅ Checklist de Entrega

- [ ] Ejercicios completados con Worker deployado
- [ ] Proyecto adaptado al dominio asignado y deployado
- [ ] URL de producción Cloudflare entregada
- [ ] Evidencias del cuestionario completadas
