# Rúbrica de Evaluación — Semana 13

> **Proyecto RAG Completo**

---

## 📊 Distribución de Puntaje

| Tipo | Peso | Mínimo para aprobar |
|------|------|---------------------|
| 🧠 Conocimiento (cuestionario) | 30% | 70% |
| 💪 Desempeño (Worker deployado) | 40% | 70% |
| 📦 Producto (proyecto entregado) | 30% | 70% |

---

## 🧠 Conocimiento (30%)

| Pregunta | Respuesta esperada |
|----------|-------------------|
| ¿Qué siglas forman RAG y qué hacen? | Retrieval-Augmented Generation: recupera docs relevantes para enriquecer el contexto del LLM |
| ¿Qué modelo de Workers AI genera embeddings de 768 dimensiones? | `@cf/baai/bge-base-en-v1.5` |
| ¿Qué header confirma que el streaming SSE está activo? | `Content-Type: text/event-stream` |
| ¿Para qué sirve el campo `r2_key` en D1? | Referencia a la clave del objeto en R2 para descargar el documento original |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker acepta POST /documents y retorna `{ id }` | 10 |
| Documento aparece en D1, R2 y Vectorize tras ingesta | 15 |
| POST /query devuelve respuesta basada en contexto recuperado | 10 |
| POST /query/stream responde con `Content-Type: text/event-stream` | 5 |
| **Total desempeño** | **40** |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Sistema RAG adaptado al dominio asignado | 10 |
| Mínimo 10 documentos indexados en producción | 10 |
| URL de producción funcional y accesible | 10 |
| **Total producto** | **30** |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
