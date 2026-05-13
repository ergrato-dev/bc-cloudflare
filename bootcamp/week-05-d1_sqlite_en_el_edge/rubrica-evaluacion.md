# Rúbrica de Evaluación — Semana 05

> **D1: SQLite en el Edge**

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
| Explica qué es D1 y cómo difiere de una base de datos externa | 25 |
| Describe el flujo de migraciones: create → apply local → apply remoto | 25 |
| Explica por qué los prepared statements previenen SQL Injection | 25 |
| Describe qué aporta DrizzleORM respecto a SQL crudo en D1 | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker deployado con D1 binding funcional en producción | 25 |
| Rutas CRUD devuelven los status HTTP correctos (200/201/404/400) | 25 |
| Queries usan prepared statements — sin concatenación de strings | 25 |
| Migraciones aplicadas con `wrangler d1 migrations apply` correctamente | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Schema adaptado al dominio asignado (tabla con ≥ 5 columnas) | 25 |
| Seed con mínimo 20 filas representativas del dominio | 25 |
| Validación Zod en rutas de mutación (POST/PUT) | 25 |
| Paginación implementada en la ruta de listado | 25 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
