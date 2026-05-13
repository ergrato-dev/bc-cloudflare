# Rúbrica de Evaluación — Semana 04

> **Workers KV y Cache API**

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
| Describe la diferencia entre consistencia eventual (KV) y consistencia fuerte | 25 |
| Explica cuándo usar TTL vs metadata para controlar el ciclo de vida | 25 |
| Diferencia `caches.default` (Cache API) de Workers KV para datos en caché | 25 |
| Describe el patrón cache-aside y por qué se usa `ctx.waitUntil` | 25 |
| **Total** | **100** |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker con binding KV funcional: `KV.get`, `KV.put`, `KV.delete`, `KV.list` | 30 |
| KV usa llaves con prefijo (`recurso:id`) y lista con `{ prefix: "..." }` | 20 |
| Worker con Cache API: `cache.match` → HIT/MISS → `cache.put` con headers | 30 |
| `ctx.waitUntil` usado para escritura de caché en background | 20 |
| **Total** | **100** |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Proyecto adaptado al dominio asignado y deployado en producción | 30 |
| Al menos dos rutas con caché (KV o Cache API) con TTL diferenciado | 25 |
| Ruta de invalidación de caché implementada y funcional | 25 |
| URL de producción entregada y `wrangler tail` muestra logs correctos | 20 |
| **Total** | **100** |

> 🚧 Criterios en desarrollo.

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
