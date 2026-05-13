# Rúbrica de Evaluación — Semana 02

> **V8 Isolates y el Runtime de Workers**

---

## 📊 Distribución de Puntaje

| Tipo | Peso | Mínimo para aprobar |
|------|------|---------------------|
| 🧠 Conocimiento (cuestionario) | 30% | 70% |
| 💪 Desempeño (Worker deployado) | 40% | 70% |
| 📦 Producto (proyecto entregado) | 30% | 70% |

---

## 🧠 Conocimiento (30%)

| Criterio | Puntaje |
|----------|---------|
| Describe correctamente las 3 fases del lifecycle de un Isolate (cold → warm → retire) | 25 |
| Explica la diferencia entre CPU time y wall-clock time con un ejemplo concreto | 25 |
| Identifica qué módulos Node.js están disponibles con `nodejs_compat_v2` y cuáles no | 25 |
| Explica la diferencia entre `HTTPException` y un error genérico de JavaScript en Hono | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntaje |
|----------|---------|
| Ejercicio 01 deployado: `app.onError` maneja `HTTPException` y devuelve JSON con status correcto | 25 |
| Ejercicio 01: `app.notFound` devuelve JSON con el path de la ruta no encontrada | 15 |
| Ejercicio 02 deployado: endpoints `/hash` y `/sign` funcionan correctamente con módulos Node.js | 30 |
| `wrangler.jsonc` tiene `compatibility_date` exacta y `nodejs_compat_v2` en ambos ejercicios | 15 |
| Middleware de logging imprime `METHOD /path → STATUS (Xms)` por cada request | 15 |

---

## 📦 Producto (30%)

| Criterio | Puntaje |
|----------|---------|
| Worker deployado en Cloudflare con URL de producción funcional | 20 |
| Proyecto adaptado al dominio asignado (nombres de rutas y datos coherentes con el dominio) | 25 |
| Validación con `HTTPException`: 400 para input inválido, 404 para recurso inexistente | 25 |
| Al menos un endpoint usa un módulo Node.js de `nodejs_compat_v2` | 20 |
| `package.json` con versiones exactas (sin `^` ni `~`) | 10 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
