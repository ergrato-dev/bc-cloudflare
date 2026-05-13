# Proyecto Semana 01 — Worker API para tu dominio

> **Etapa 0 — Fundamentos del Edge**

Construye la primera versión de la API para tu dominio asignado.
Este Worker será la base que extenderás durante todo el bootcamp.

---

## Contexto

Cada aprendiz trabaja sobre un **dominio único asignado** por el instructor
(ej: clínica veterinaria, escape room, marina deportiva…).

Esta semana construyes el esqueleto: las rutas principales de tu API
con datos estáticos en memoria, usando Hono como framework.

---

## Requisitos

### Rutas mínimas a implementar

| Ruta | Descripción |
|------|-------------|
| `GET /` | Información general de tu negocio |
| `GET /[recurso-principal]` | Lista de entidades (min 10 items) |
| `GET /[recurso-principal]/:id` | Detalle de una entidad |
| `GET /[recurso-secundario]` | Segunda colección del dominio |
| `GET /health` | `{ status: "ok", domain: "nombre" }` |

### Estándares obligatorios

- Hono como framework de routing
- Tipos explícitos en TypeScript (`type Bindings`, interfaces para tus datos)
- Middleware de logging en todas las rutas
- Handler `notFound` con JSON `{ error: "Not found" }`
- Datos de prueba **reales** para tu dominio (no `item1`, `item2`)

---

## Instrucciones

**Abre `starter/src/index.ts`** y:

1. Define las interfaces de tus entidades de dominio
2. Crea arrays de datos de prueba con al menos 10 elementos cada uno
3. Implementa las rutas mínimas con Hono
4. Añade middleware de logging
5. Añade `notFound` handler

---

## Deploy

```bash
cd starter
pnpm install
pnpm dev        # Prueba local en localhost:8787

pnpm deploy     # Despliega a producción
```

Entrega la URL de producción `https://<nombre>.<subdominio>.workers.dev`
junto con capturas de al menos 3 rutas funcionando.
