// ============================================
// PROYECTO SEMANAL: API con Error Handling y Runtime Avanzado
// Semana 02 — V8 Isolates y el Runtime de Workers
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado por el instructor.
// Cambia los nombres de tipos, rutas y datos de prueba según tu dominio.
// Ejemplos:
//   Clínica veterinaria → Item = Patient, /items → /patients
//   Escape room         → Item = Room, /items → /rooms
//   Marina deportiva    → Item = Boat, /items → /boats

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

// TODO 1: Si usas módulos Node.js (crypto, buffer, etc.),
// importa los que necesites aquí
// Ejemplo: import { createHash, randomBytes } from "crypto";

export interface Env {
  APP_SECRET: string;
}

// ============================================
// TODO 2: Define la interfaz de tu recurso principal
// ============================================
// Reemplaza "Item" con el nombre del recurso de tu dominio
// Ejemplo: interface Patient { ... } / interface Room { ... }
interface Item {
  id: number;
  name: string;
  // TODO: añade los campos relevantes para tu dominio
}

// ============================================
// TODO 3: Crea los datos de prueba (mínimo 10 ítems)
// ============================================
// Reemplaza los placeholders con datos realistas de tu dominio
const ITEMS: Item[] = [
  { id: 1, name: "Elemento 1" },
  { id: 2, name: "Elemento 2" },
  { id: 3, name: "Elemento 3" },
  { id: 4, name: "Elemento 4" },
  { id: 5, name: "Elemento 5" },
  { id: 6, name: "Elemento 6" },
  { id: 7, name: "Elemento 7" },
  { id: 8, name: "Elemento 8" },
  { id: 9, name: "Elemento 9" },
  { id: 10, name: "Elemento 10" },
];

const app = new Hono<{ Bindings: Env }>();

// ============================================
// TODO 4: Middleware de logging con timing
// ============================================
// Registra método, pathname, status y duración en ms
// Hint: app.use("*", async (c, next) => { ... await next() ... })

// ============================================
// TODO 5: Error handler global
// ============================================
// Maneja HTTPException con su status, y cualquier otro error con 500
// Hint: app.onError((err, c) => { if (err instanceof HTTPException) ... })

// ============================================
// TODO 6: GET /items — listar todos los recursos
// ============================================
// Devuelve { items: Item[], total: number }
// Bonus: acepta query param ?name= para filtrar por nombre

// ============================================
// TODO 7: GET /items/:id — obtener recurso por ID
// ============================================
// Valida que :id sea numérico → HTTPException(400) si no lo es
// Busca el ítem → HTTPException(404) si no existe
// Hint: /^\d+$/.test(rawId) para validar que es numérico

// ============================================
// TODO 8 (BONUS): Endpoint que use un módulo Node.js
// ============================================
// Ejemplo A: GET /items/:id/token → genera un token único para el ítem
// Ejemplo B: POST /checksum → calcula SHA-256 de un texto recibido
// Hint: usa randomBytes(16).toString("hex") o createHash("sha256")...

// GET /health
app.get("/health", (c) => {
  return c.json({ status: "ok", items: ITEMS.length });
});

// ============================================
// TODO 9: Not found handler
// ============================================
// Devuelve JSON con { error, path } cuando no se encuentra la ruta

export default app;
