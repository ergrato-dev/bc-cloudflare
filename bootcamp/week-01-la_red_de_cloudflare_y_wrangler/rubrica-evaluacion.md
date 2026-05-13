# Rúbrica de Evaluación — Semana 01

> **La Red de Cloudflare y Wrangler 3**

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
| Explica correctamente qué es Anycast y cómo afecta la latencia | 25 |
| Describe la diferencia entre `wrangler dev` y `wrangler dev --remote` | 25 |
| Identifica qué APIs están disponibles en el runtime de Workers | 25 |
| Explica para qué sirve `ctx.waitUntil()` | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Ejercicio 01 deployado y rutas responden correctamente | 25 |
| Ejercicio 02 deployado con Hono, middleware y 404 funcionando | 25 |
| `wrangler.jsonc` con `compatibility_date` exacta y `nodejs_compat_v2` | 25 |
| `package.json` sin rangos de versión (`^`, `~`) | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Worker deployado en cuenta propia con URL de producción | 30 |
| Rutas adaptadas al dominio asignado (no nombres genéricos) | 30 |
| Datos de prueba reales (min 10 items, no "item1", "item2") | 20 |
| Middleware de logging y handler `notFound` implementados | 20 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
