// ============================================
// EJERCICIO 02: Primer Worker con Hono
// ============================================
// Objetivo: enrutar requests con Hono, añadir
// middleware de logging y manejar errores.

import { Hono } from "hono";

export interface Env {}

// ============================================
// TODO 1: Crea la instancia de Hono tipada con Env
// Hint: const app = new Hono<{ Bindings: Env }>()
// ============================================

// ============================================
// TODO 4: Registra un middleware de logging
// que imprima: METHOD PATH STATUS TIMEms
// Hint: app.use("*", async (c, next) => { ... })
// IMPORTANTE: debe ir ANTES de las rutas
// ============================================

// ============================================
// TODO 2: Implementa estas rutas:
//   GET /          → texto "Bienvenido al catálogo"
//   GET /items     → JSON con array de 10 items de prueba
//                    [{ id: 1, name: "...", price: N }, ...]
//   GET /items/featured → JSON con 3 items destacados
//   GET /categories → JSON con array de categorías
//   GET /health    → JSON { status: "ok", version: "1.0.0" }
// ============================================

// ============================================
// TODO 3: Implementa la ruta GET /items/:id
//   Lee el param "id" con c.req.param("id")
//   Si id no es un número válido → 400 { error: "ID inválido" }
//   Si id > 10 → 404 { error: "Item no encontrado" }
//   Si es válido → 200 { id: N, name: "Item N", price: N * 100 }
// ============================================

// ============================================
// TODO 5: Añade un handler para rutas no encontradas
// Hint: app.notFound((c) => c.json({ error: "Not found" }, 404))
// ============================================

// export default app  ← descomentar cuando hayas creado app
export default {};
