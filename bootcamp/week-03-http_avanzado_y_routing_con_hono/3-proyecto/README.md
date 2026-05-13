# Proyecto Semana 03 — API REST con Routing, Validación y JWT

## Descripción

Construirás una API REST completa para tu **dominio asignado** aplicando
los tres pilares de la semana: routing avanzado con `app.route()`,
validación de inputs con Zod y autenticación con JWT.

---

## Objetivos del Proyecto

- Diseñar una API con al menos **dos recursos** organizados con `app.route()`
- Validar todos los inputs con `zValidator` y schemas Zod
- Proteger las rutas de escritura con autenticación JWT
- Manejar errores de forma consistente con `HTTPException`

---

## Nota para el Aprendiz

**Adapta este Worker a tu dominio asignado.**

Ejemplos de adaptación según dominio:

- Clínica veterinaria → `/animals` (catálogo), `/appointments` (protegido)
- Escape room         → `/rooms` (catálogo), `/bookings` (protegido)
- Biblioteca          → `/books` (catálogo), `/loans` (protegido)
- Marina deportiva    → `/boats` (catálogo), `/slips` (protegido)
- Floristería         → `/flowers` (catálogo), `/orders` (protegido)

La zona pública expone el catálogo de tu recurso principal.
La zona protegida maneja las operaciones de escritura (crear, modificar, eliminar).

---

## Estructura esperada

```
src/
├── index.ts          # App principal, error handler, montaje de rutas
├── routes/
│   ├── catalog.ts    # Sub-router del catálogo (rutas públicas)
│   └── protected.ts  # Sub-router de operaciones protegidas (requiere JWT)
└── middleware/
    └── auth.ts       # Middleware requireAuth con verify()
```

---

## Instrucciones de entrega

```bash
pnpm install
wrangler dev       # Probar en local

# Comandos de prueba que debe cumplir tu proyecto:
# 1. POST /auth/login con credenciales válidas → 200 + token
# 2. POST /auth/login con credenciales inválidas → 401
# 3. GET /<recurso> sin token → 200 (ruta pública)
# 4. POST /<recurso> sin token → 401
# 5. POST /<recurso> con token válido + datos inválidos → 422
# 6. POST /<recurso> con token válido + datos válidos → 201
```

---

## Criterios mínimos

- [ ] Login genera un JWT con `sign` que expira en 1 hora
- [ ] Rutas de escritura usan `requireAuth` con `verify`
- [ ] Al menos un endpoint usa `zValidator("json", schema)` con error 422
- [ ] `app.route()` organiza los recursos en sub-routers
- [ ] Mínimo 10 ítems de datos iniciales en el catálogo
