# Proyecto Semanal — Workers KV + Cache API

## Semana 04 · Workers KV y Cache API

Construye una **API de catálogo con persistencia en KV y caché HTTP**
adaptada a tu dominio asignado.

---

## Objetivo

Combinar Workers KV (persistencia global) y Cache API (caché HTTP por PoP)
para entregar un API de alto rendimiento con invalidación controlada.

---

## Requisitos funcionales

| Ruta                        | Descripción                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `POST /seed`                | Precarga mínimo 10 ítems en KV (para `wrangler dev`)         |
| `GET /catalog`              | Lista catálogo; usa Cache API con `max-age=300`              |
| `GET /catalog/:id`          | Detalle de ítem; usa Cache API con `max-age=600`             |
| `POST /catalog`             | Crea ítem en KV con validación Zod + metadata                |
| `PUT /catalog/:id`          | Actualiza ítem en KV + invalida caché con `cache.delete`     |
| `DELETE /catalog/:id`       | Elimina ítem de KV + invalida caché con `cache.delete`       |
| `DELETE /cache/catalog`     | Purga manual de la caché del listado                         |
| `GET /health`               | Estado del Worker — nunca cacheado                           |

---

## Nota para el aprendiz

**Adapta este Worker a tu dominio asignado.**

Ejemplos de adaptación según dominio:

- **Clínica veterinaria** → catálogo de servicios médicos, llaves `services:{id}`
- **Escape room** → catálogo de salas, llaves `rooms:{id}`
- **Vivero** → catálogo de plantas, llaves `plants:{id}`
- **Estudio de tatuajes** → diseños disponibles, llaves `designs:{id}`
- **Agencia de viajes** → destinos y tours, llaves `tours:{id}`

Cambia los nombres de rutas, tipos y datos de ejemplo para que reflejen
tu dominio. El binding `CATALOG_KV` puede renombrarse (p. ej. `ROOMS_KV`).

---

## Criterios de evaluación

- [ ] `POST /seed` carga ≥ 10 ítems en KV
- [ ] `GET /catalog` devuelve `X-Cache: HIT` en la segunda petición
- [ ] `POST /catalog` valida el body con Zod y persiste en KV con metadata
- [ ] `PUT /catalog/:id` actualiza en KV y llama a `cache.delete` correctamente
- [ ] Worker deployado con `wrangler deploy` (URL de producción requerida)
