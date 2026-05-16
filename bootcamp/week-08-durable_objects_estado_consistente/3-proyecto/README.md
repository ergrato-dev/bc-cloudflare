# Proyecto Semana 08 — Gestor de Estado con Durable Objects

## Descripción

Construye un Worker que gestiona el **estado de recursos individuales** de tu
dominio usando Durable Objects. Cada recurso tiene un ciclo de vida con estados
definidos, un historial de transiciones y expiración automática con Alarms.

---

## Objetivos

- Modelar el ciclo de vida de un recurso de tu dominio como un Durable Object
- Implementar transiciones de estado con Storage API y `transaction()`
- Usar Alarms para expirar recursos inactivos automáticamente
- Integrar el DO con las rutas Hono del Worker

---

## Dominios de ejemplo

Adapta el Worker a tu dominio asignado:

| Dominio | Recurso | Estados |
|---------|---------|---------|
| Clínica veterinaria | Turno de consulta | `libre → reservado → en_curso → completado` |
| Escape room | Sala | `disponible → reservada → en_juego → finalizada` |
| Marina deportiva | Amarre | `libre → reservado → ocupado → liberado` |
| Librería | Ejemplar | `disponible → apartado → vendido → devuelto` |

---

## Estructura

```
starter/
├── wrangler.jsonc    # DO bindings + migrations
├── package.json
├── .npmrc
├── tsconfig.json
└── src/
    └── index.ts      # TODOs a implementar
```

---

## Rutas requeridas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/resources/:id` | Estado actual del recurso |
| `POST` | `/resources/:id/transition` | Cambiar el estado del recurso |
| `GET` | `/resources/:id/history` | Historial de transiciones |
| `POST` | `/resources/:id/expire` | Forzar expiración (para tests) |

---

## Criterios de evaluación

- [ ] `GET /resources/:id` devuelve estado actual con timestamps
- [ ] `POST /resources/:id/transition` valida con Zod y usa `transaction()`
- [ ] El historial almacena al menos 20 transiciones recientes
- [ ] La Alarm expira el recurso si lleva más de 30 minutos sin actividad
