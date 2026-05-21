# Proyecto Semanal — Workers AI: Asistente Inteligente

## Descripción

Construye un Worker que actúa como asistente AI temático para tu dominio
asignado. El asistente usa un LLM con un system prompt personalizado y expone
endpoints para chat con streaming, análisis de contenido y embeddings.

---

## Objetivo

Adaptar el Worker a tu **dominio asignado** e implementar un asistente AI
que responda preguntas específicas del dominio en modo streaming.

---

## Ejemplos de adaptación por dominio

| Dominio            | System prompt base                                 | Endpoints sugeridos             |
|--------------------|----------------------------------------------------|---------------------------------|
| Clínica veterinaria| "Eres un asistente veterinario. Orienta sobre salud animal." | POST /consult/stream |
| Escape room        | "Eres un guía de escape rooms. Ayuda sin revelar soluciones." | POST /hint/stream |
| Marina deportiva   | "Eres un experto náutico. Asesora sobre regatas y maniobras." | POST /advise/stream |
| Librería digital   | "Eres un librero literario. Recomienda lecturas y describe obras." | POST /recommend/stream |
| Consultorio médico | "Eres un asistente médico informativo. Solo orientación general." | POST /info/stream |

---

## Requisitos

### Mínimos (aprobación)

- [ ] Worker desplegado con binding `AI` declarado en `wrangler.jsonc`
- [ ] `POST /chat` — respuesta completa JSON del LLM con system prompt temático
- [ ] `POST /chat/stream` — streaming SSE con tokens progresivos
- [ ] `POST /embeddings` — vector de 768 dims del texto enviado
- [ ] Validación Zod en todos los endpoints de entrada de texto

### Avanzados (distinción)

- [ ] System prompt adaptado al dominio con contexto específico (> 100 caracteres)
- [ ] `GET /health` que devuelve modelo activo, fecha y un embedding de prueba
- [ ] Manejo de errores: si el modelo falla, responde 503 con mensaje descriptivo
- [ ] Header `X-Model` en todas las respuestas con el nombre del modelo usado

---

## Entrega

1. URL del Worker en producción (`wrangler deploy`)
2. Captura de `curl` en streaming mostrando tokens progresivos
3. Captura de `curl` a `/embeddings` con el vector truncado

---

## Tiempo estimado

**2 – 2.5 horas**

- Configurar binding AI: 10 min
- System prompt temático: 20 min
- Implementación Worker: 80 – 90 min
- Deploy + pruebas: 20 min
