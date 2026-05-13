// ============================================
// EJERCICIO 02 — SOLUCIÓN
// ============================================

import { Hono } from "hono";

export interface Env {}

// TODO 1: instancia Hono tipada
const app = new Hono<{ Bindings: Env }>();

// Datos de prueba (mínimo 10 items — regla del bootcamp)
const ITEMS = [
  { id: 1, name: "Laptop ultradelgada", price: 1200 },
  { id: 2, name: "Teclado mecánico", price: 95 },
  { id: 3, name: "Monitor 4K 27\"", price: 480 },
  { id: 4, name: "Ratón inalámbrico", price: 45 },
  { id: 5, name: "Auriculares noise-cancel", price: 220 },
  { id: 6, name: "Webcam 1080p", price: 78 },
  { id: 7, name: "Hub USB-C 7 puertos", price: 55 },
  { id: 8, name: "Soporte laptop aluminio", price: 38 },
  { id: 9, name: "Luz LED escritorio", price: 29 },
  { id: 10, name: "Alfombrilla XL", price: 22 },
];

const CATEGORIES = ["Computación", "Periféricos", "Audio", "Accesorios"];

// TODO 4: middleware de logging
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${ms}ms`);
});

// TODO 2: rutas principales
app.get("/", (c) => c.text("Bienvenido al catálogo"));

app.get("/items", (c) => c.json(ITEMS));

app.get("/items/featured", (c) => c.json(ITEMS.slice(0, 3)));

app.get("/categories", (c) => c.json(CATEGORIES));

app.get("/health", (c) => c.json({ status: "ok", version: "1.0.0" }));

// TODO 3: ruta con parámetro (antes del 404)
app.get("/items/:id", (c) => {
  const idStr = c.req.param("id");
  const id = Number(idStr);
  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ error: "ID inválido" }, 400);
  }
  const item = ITEMS.find((i) => i.id === id);
  if (!item) return c.json({ error: "Item no encontrado" }, 404);
  return c.json(item);
});

// TODO 5: 404 genérico
app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
