# Rúbrica de Evaluación — Semana 11

> **Vectorize: Vector Database en el Edge**

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
| Explica qué es un índice Vectorize y su dimensión | 25 |
| Diferencia `insert` de `upsert` y cuándo usar cada uno | 25 |
| Describe el flujo completo: texto → embedding → Vectorize → resultado | 25 |
| Identifica al menos 2 parámetros de búsqueda ANN (`topK`, `filter`) | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Índice Vectorize creado con dimensión y métrica correctas | 20 |
| Worker con `upsert` de vectores con metadata funcional | 25 |
| Endpoint de búsqueda ANN devuelve resultados con scores | 30 |
| Búsqueda semántica usando embeddings de Workers AI + Vectorize | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Worker desplegado en producción con binding `VECTORIZE` | 25 |
| Al menos 20 vectores insertados con metadata del dominio | 25 |
| Endpoint de búsqueda semántica operativo en producción | 30 |
| Validación Zod en todos los endpoints de entrada | 20 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
