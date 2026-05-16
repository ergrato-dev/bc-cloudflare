# Rúbrica de Evaluación — Semana 08

> **Durable Objects: Estado Consistente en el Edge**

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
| Explica el modelo de actor y qué garantiza `idFromName()` | 25 |
| Describe la diferencia entre Storage API y Workers KV | 25 |
| Explica para qué sirven los Alarms y cuántos puede tener un DO | 25 |
| Describe qué problema resuelven los DO Facets | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| DO con Storage API deployado — `GET` y `POST` responden correctamente | 25 |
| `idFromName()` produce la misma instancia para el mismo nombre | 25 |
| Alarm configura reset de ventana y `alarm()` ejecuta correctamente | 25 |
| `wrangler.jsonc` incluye `durable_objects.bindings` y `migrations` | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| DO adaptado al dominio asignado con estado representativo | 25 |
| Storage API con transacción (`transaction()`) usada en al menos una ruta | 25 |
| Alarm implementada para expiración o reset automático | 25 |
| `wrangler tail` muestra logs del DO procesando peticiones reales | 25 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
