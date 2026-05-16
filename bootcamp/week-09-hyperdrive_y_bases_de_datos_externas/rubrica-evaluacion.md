# Rúbrica de Evaluación — Semana 09

> **Hyperdrive y Bases de Datos Externas**

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
| Explica por qué los Workers no pueden conectarse directamente a PostgreSQL | 25 |
| Describe qué problema resuelve Hyperdrive y cómo lo resuelve | 25 |
| Explica qué tipos de queries son cacheables por Hyperdrive | 25 |
| Describe qué hace `localConnectionString` en `wrangler.jsonc` | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker deployado con binding Hyperdrive declarado en `wrangler.jsonc` | 25 |
| `GET /records` devuelve filas de PostgreSQL externo en producción | 25 |
| `POST /records` inserta con prepared statement (sin concatenación de strings) | 25 |
| Caching de Hyperdrive configurado con `maxAge` en `wrangler.jsonc` | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Schema PostgreSQL adaptado al dominio con mínimo 20 filas de seed | 25 |
| CRUD completo (GET lista, GET por ID, POST, PATCH, DELETE) funcional | 25 |
| Validación Zod en todos los endpoints de mutación | 25 |
| Worker responde < 500ms en producción (verificado con `curl -w "%{time_total}"`) | 25 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
