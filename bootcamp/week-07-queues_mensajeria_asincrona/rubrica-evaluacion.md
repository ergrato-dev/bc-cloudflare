# Rúbrica de Evaluación — Semana 07

> **Queues: Mensajería Asíncrona**

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
| Explica qué es una Queue y el modelo productor/consumidor | 25 |
| Describe la diferencia entre `send()` y `sendBatch()` | 25 |
| Explica cuándo usar `message.ack()` vs `message.retry()` | 25 |
| Describe para qué sirve la Dead Letter Queue (DLQ) | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker productor deployado — `POST /events` encola mensajes correctamente | 25 |
| Worker consumidor deployado — handler `queue` procesa el batch sin errores | 25 |
| `ackAll()` sólo se llama cuando todos los mensajes se procesaron con éxito | 25 |
| DLQ configurada en `wrangler.jsonc` y mensajes fallidos redirigidos | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Queue adaptada al dominio asignado (evento representativo del dominio) | 25 |
| Mensajes incluyen payload JSON tipado con Zod en el productor | 25 |
| Consumidor persiste resultado en D1 o KV (integración con semanas previas) | 25 |
| `wrangler tail` muestra logs del consumidor procesando mensajes reales | 25 |

> 🚧 Criterios en desarrollo.

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
