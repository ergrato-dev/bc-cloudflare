# Rúbrica de Evaluación — Semana 10

> **Workers AI: Inferencia sin GPU propia**

---

## 📊 Distribución de Puntaje

| Tipo | Peso | Mínimo para aprobar |
|------|------|---------------------|
| 🧠 Conocimiento (cuestionario) | 30% | 70% |
| 💪 Desempeño (Worker deployado) | 40% | 70% |
| 📦 Producto (proyecto entregado) | 30% | 70% |

---

## 🧠 Conocimiento (30%)

| Criterio | Puntos |
|----------|--------|
| Explica qué es el binding `AI` y cómo se declara en `wrangler.jsonc` | 25 |
| Describe la diferencia entre respuesta completa y streaming SSE en Workers AI | 25 |
| Explica para qué se usan los embeddings y qué modelo devuelve vectores de 768 dims | 25 |
| Describe qué modelo se usa para speech-to-text y qué devuelve su respuesta | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker deployado con binding `AI` declarado correctamente en `wrangler.jsonc` | 25 |
| `POST /chat` devuelve respuesta de LLM (completa o streaming) en producción | 25 |
| `POST /embeddings` devuelve vector numérico de la frase enviada | 25 |
| Tipos `Bindings` con `AI: Ai` declarados en `src/index.ts` | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Asistente AI adaptado al dominio asignado con system prompt temático | 25 |
| Streaming SSE funcional: cliente recibe tokens progresivos | 25 |
| Validación Zod en todos los endpoints de mutación | 25 |
| Worker responde en producción con latencia < 3s para el primer token (TTFT) | 25 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
