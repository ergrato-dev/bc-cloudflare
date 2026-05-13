# Rúbrica de Evaluación — Semana 03

> **HTTP Avanzado y Routing con Hono**

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
| Explica la diferencia entre path params (`:id`) y query params (`?limit=`) con ejemplos | 25 |
| Describe para qué sirve `app.route()` y cómo ayuda a modularizar un Worker | 25 |
| Explica qué valida `zValidator` y cuándo devuelve 422 vs 400 | 25 |
| Describe el flujo completo de JWT: generación → header → verificación → payload en contexto | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntaje |
|----------|---------|
| Ejercicio 01 deployado: routing con path params, query params y `app.route()` funcional | 20 |
| Ejercicio 01: `zValidator` rechaza inputs inválidos con 422 y JSON descriptivo | 20 |
| Ejercicio 02 deployado: `POST /auth/login` devuelve JWT válido | 20 |
| Ejercicio 02: rutas protegidas devuelven 401 sin token y 200 con token válido | 20 |
| `wrangler.jsonc` con `compatibility_date` exacta y `nodejs_compat_v2` en ambos ejercicios | 20 |

---

## 📦 Producto (30%)

| Criterio | Puntaje |
|----------|---------|
| Worker deployado en Cloudflare con URL de producción funcional | 20 |
| Proyecto adaptado al dominio asignado con rutas coherentes | 20 |
| Validación Zod en todos los endpoints de mutación (POST, PUT, PATCH) | 20 |
| Rutas protegidas con JWT devuelven el payload del token en la respuesta | 20 |
| `package.json` con versiones exactas (sin `^` ni `~`) | 20 |}

> 🚧 Criterios en desarrollo.

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
