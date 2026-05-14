# Rúbrica de Evaluación — Semana 06

> **R2: Object Storage**

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
| Explica qué es R2 y por qué no tiene costos de egress | 25 |
| Describe las operaciones básicas: `put`, `get`, `delete`, `list` | 25 |
| Explica para qué sirve `customMetadata` y `httpMetadata` | 25 |
| Describe cómo implementar acceso controlado con tokens temporales en KV | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Worker deployado con binding R2 funcional en producción | 25 |
| `PUT /files/:key` guarda el objeto con `Content-Type` correcto | 25 |
| `GET /files/:key` sirve el objeto con headers HTTP correctos | 25 |
| `GET /files` lista objetos con `truncated`, `cursor` y `customMetadata` | 25 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Bucket R2 adaptado al dominio asignado (fotos, documentos, etc.) | 25 |
| `customMetadata` incluye al menos 3 campos del dominio | 25 |
| Ruta de descarga devuelve headers `Content-Type` y `Content-Disposition` | 25 |
| Acceso a archivos protegido con tokens temporales (KV + TTL) | 25 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
