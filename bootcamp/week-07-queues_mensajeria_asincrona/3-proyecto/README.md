# Proyecto Semana 07 — Pipeline de Eventos con Queues

## Descripción

Construye un Worker que procesa eventos de tu dominio de forma **asíncrona**
usando Cloudflare Queues. Los eventos se encolan desde un endpoint HTTP y se
procesan en segundo plano, persistiendo resultados en KV o D1.

---

## Objetivos

- Configurar una Queue con binding de productor y consumidor
- Implementar un endpoint HTTP que encola eventos validados con Zod
- Procesar eventos en el handler `queue()` y persistirlos
- Configurar una DLQ para capturar mensajes fallidos

---

## Dominios de ejemplo

Adapta este Worker a tu dominio asignado:

| Dominio | Evento que encolar | Dónde persistir |
|---------|-------------------|-----------------|
| Clínica veterinaria | Cita agendada | D1 / KV |
| Escape room | Reserva realizada | D1 / KV |
| Marina deportiva | Check-in de embarcación | KV |
| Librería | Venta completada | D1 |

---

## Estructura del proyecto

```
starter/
├── wrangler.jsonc    # Queue + KV/D1 bindings
├── package.json      # Dependencias exactas
├── .npmrc
├── tsconfig.json
└── src/
    └── index.ts      # TODOs a implementar
```

---

## Rutas requeridas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/events` | Encola un evento (produce) |
| `GET`  | `/events/processed` | Lista eventos procesados desde KV |
| `GET`  | `/events/failed` | Lista eventos en DLQ (desde KV) |

---

## Criterios de evaluación

- [ ] `POST /events` devuelve 202 con validación Zod
- [ ] El consumidor persiste cada evento en KV con clave `processed:<id>:<ts>`
- [ ] Los mensajes fallidos de la DLQ se guardan en KV bajo `failed:<id>:<ts>`
- [ ] `wrangler tail` muestra los logs del consumidor en tiempo real
