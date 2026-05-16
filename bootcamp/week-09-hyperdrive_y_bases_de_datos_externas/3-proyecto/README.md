# Proyecto Semanal — Hyperdrive y Bases de Datos Externas

## Descripción

Construye una API REST completa que conecta a PostgreSQL externo mediante
Hyperdrive, con caching activado para queries de lectura frecuente.

---

## Objetivo

Adaptar el Worker a tu **dominio asignado** e implementar una API que persista
datos en PostgreSQL con conexión optimizada por Hyperdrive.

---

## Ejemplos de adaptación por dominio

| Dominio            | Tabla sugerida   | Rutas principales                    |
|--------------------|------------------|--------------------------------------|
| Clínica veterinaria| `patients`       | GET/POST /patients, PATCH /patients/:id |
| Escape room        | `rooms`          | GET/POST /rooms, PATCH /rooms/:id/availability |
| Marina deportiva   | `boats`          | GET/POST /boats, PATCH /boats/:id/berth |
| Librería digital   | `books`          | GET/POST /books, PATCH /books/:id/stock |
| Consultorio médico | `appointments`   | GET/POST /appointments, PATCH /appointments/:id/status |

---

## Requisitos

### Mínimos (aprobación)

- [ ] Worker desplegado con Hyperdrive binding configurado
- [ ] Tabla con mínimo **20 filas** en el seed
- [ ] `GET /records` — listar entidades activas
- [ ] `POST /records` — crear con validación Zod
- [ ] `DELETE /records/:id` — soft delete (`active = false`)
- [ ] Caching activado en `wrangler.jsonc` (`maxAge: 60`)

### Avanzados (distinción)

- [ ] `GET /records/:id` — obtener por ID con 404 correcto
- [ ] `PATCH /records/:id` — actualización parcial con Zod
- [ ] Header `X-Query-Ms` en rutas de lectura
- [ ] Manejo de `PostgresError` en mutaciones con respuesta 500 descriptiva

---

## Entrega

1. URL del Worker en producción (`wrangler deploy`)
2. Captura o logs de `curl` mostrando al menos 3 rutas distintas
3. Screenshot del dashboard de Cloudflare con el Hyperdrive config activo

---

## Archivos de referencia

- Schema base en `starter/schema.sql` — adaptar columnas a tu dominio
- Seed base en `starter/seed.sql` — rellenar con datos de tu dominio (mínimo 20 filas)
- Worker base en `starter/src/index.ts` — completar los TODOs

---

## Tiempo estimado

**2 – 2.5 horas**

- Configuración DB + Hyperdrive: 30 min
- Schema + seed: 20 min
- Implementación Worker: 60 – 70 min
- Deploy + pruebas: 20 min
