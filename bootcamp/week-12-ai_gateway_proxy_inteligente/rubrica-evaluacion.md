# Rúbrica de Evaluación — Semana 12

> **AI Gateway: Proxy Inteligente**

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
| Explica qué intercepta AI Gateway y qué ventajas aporta | 25 |
| Describe cómo se activa la caché y qué parámetro controla el TTL | 25 |
| Diferencia el endpoint específico del universal (fallback) | 25 |
| Identifica al menos 2 proveedores soportados además de Workers AI | 25 |

---

## 💪 Desempeño (40%)

| Criterio | Puntos |
|----------|--------|
| Gateway creado en dashboard y gateway ID correcto en el código | 20 |
| Workers AI llamado a través del gateway con opción `gateway` | 30 |
| Caché funcional: segunda llamada idéntica devuelve `cf-aig-cache-status: HIT` | 30 |
| Fallback multi-proveedor operativo con endpoint universal | 20 |

---

## 📦 Producto (30%)

| Criterio | Puntos |
|----------|--------|
| Worker desplegado con AI Gateway integrado | 25 |
| Logs visibles en el dashboard de AI Gateway | 25 |
| Rate limiting configurado en el gateway (plan Free o superior) | 25 |
| Validación Zod en todos los endpoints de entrada | 25 |

---

## 📋 Requisitos de Entrega

- URL de producción del Worker (`*.workers.dev` o dominio custom)
- Código fuente en repositorio personal del aprendiz
- Worker responde correctamente en producción al momento de revisión
