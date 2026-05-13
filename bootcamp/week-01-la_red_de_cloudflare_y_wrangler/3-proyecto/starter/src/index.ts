// ============================================
// PROYECTO SEMANA 01 — API Worker para tu dominio
// Etapa 0 — Fundamentos del Edge
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker completamente a tu dominio asignado.
// Los comentarios entre [ ] indican dónde personalizar.
//
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → /pets, /appointments, /vets
//   Escape room         → /rooms, /bookings, /themes
//   Marina deportiva    → /boats, /berths, /services
//   Gimnasio crossfit   → /athletes, /classes, /wods

import { Hono } from "hono";

// ============================================
// TODO: Define las interfaces de tu dominio
// Ejemplo:
//   interface Pet { id: number; name: string; species: string; age: number }
//   interface Appointment { id: number; petId: number; date: string; reason: string }
// ============================================
export interface Env {}

// ============================================
// TODO: Crea los arrays de datos de prueba
// Mínimo 10 elementos en el recurso principal
// Usa datos REALES para tu dominio, no "item1", "item2"
// ============================================

const app = new Hono<{ Bindings: Env }>();

// ============================================
// TODO: Añade middleware de logging
// app.use("*", async (c, next) => { ... })
// ============================================

// ============================================
// TODO: Ruta raíz GET /
// Devuelve información general del negocio:
//   { name: string, domain: string, version: string }
// ============================================

// ============================================
// TODO: Ruta GET /[recurso-principal]
// Devuelve la lista completa de tu recurso principal
// ============================================

// ============================================
// TODO: Ruta GET /[recurso-principal]/:id
// Devuelve una entidad por ID
// 404 si no existe, 400 si el ID no es válido
// ============================================

// ============================================
// TODO: Ruta GET /[recurso-secundario]
// Segunda colección relevante para tu dominio
// ============================================

// ============================================
// TODO: Ruta GET /health
// { status: "ok", domain: "[tu-dominio]", ts: Date.now() }
// ============================================

// ============================================
// TODO: Handler notFound
// app.notFound((c) => c.json({ error: "Not found" }, 404))
// ============================================

export default app;
