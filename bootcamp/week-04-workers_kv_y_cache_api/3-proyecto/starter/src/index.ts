// ============================================
// PROYECTO SEMANAL: API de Catálogo con KV + Cache API
// Semana 04 — Workers KV y Cache API
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → servicios médicos, llaves services:{id}
//   Escape room         → salas, llaves rooms:{id}
//   Vivero              → plantas, llaves plants:{id}
//   Estudio de tatuajes → diseños, llaves designs:{id}
//
// Renombra los tipos, rutas y datos de seed para reflejar tu dominio.

import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

// ============================================
// TODO 1: Define el tipo de tu ítem de catálogo
// Ejemplo genérico — reemplaza con los campos de tu dominio
// ============================================
type CatalogItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  available: boolean;
};

// Metadata ligera para KV.list (≤ 1 024 B)
type ItemMeta = {
  category: string;
  available: boolean;
};

// ============================================
// TODO 2: Define el schema Zod para validar el body de creación
// Hint: usa z.object({ name: z.string().min(1), ... })
// ============================================
const itemSchema = z.object({
  // TODO: define los campos de tu ítem
});

type Env = {
  CATALOG_KV: KVNamespace;
};

// ============================================
// TODO 3: Define los datos de seed (mínimo 10 ítems)
// Adapta los valores a tu dominio asignado
// ============================================
const SEED_ITEMS: CatalogItem[] = [
  // TODO: añade al menos 10 ítems representativos de tu dominio
  // { id: "1", name: "...", description: "...", category: "...", price: 0, available: true },
];

const app = new Hono<{ Bindings: Env }>();

// ============================================
// POST /seed — precarga ítems en KV
// ============================================
app.post("/seed", async (c) => {
  // TODO 4: guarda cada ítem en CATALOG_KV con:
  //   llave:  `catalog:{item.id}`
  //   valor:  JSON.stringify(item)
  //   opts:   { metadata: { category, available }, expirationTtl: 86400 }
  // Hint: usa Promise.all para paralelizar
  // TODO: devuelve c.json({ seeded: SEED_ITEMS.length })
});

// ============================================
// GET /catalog — lista con caché HTTP (5 min)
// ============================================
app.get("/catalog", async (c) => {
  const cache    = caches.default;
  const cacheKey = c.req.raw;

  // TODO 5: implementa el patrón HIT/MISS con Cache API
  //   HIT:  const cached = await cache.match(cacheKey); if (cached) return cached;
  //   MISS: lee todas las llaves de KV con list({ prefix: "catalog:", limit: 100 })
  //         carga los valores en paralelo con Promise.all
  //         construye Response con Cache-Control: public, max-age=300
  //         c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()))
});

// ============================================
// GET /catalog/:id — detalle con caché HTTP (10 min)
// ============================================
app.get("/catalog/:id", async (c) => {
  const id       = c.req.param("id");
  const cache    = caches.default;
  const cacheKey = c.req.raw;

  // TODO 6: HIT → devuelve cached
  //   MISS → CATALOG_KV.get<CatalogItem>(`catalog:${id}`, { type: "json" })
  //          si null → HTTPException(404)
  //          Cache-Control: public, max-age=600
  //          waitUntil + devuelve respuesta
});

// ============================================
// POST /catalog — crea un ítem con validación
// ============================================
app.post("/catalog", zValidator("json", itemSchema), async (c) => {
  const data = c.req.valid("json");
  const id   = crypto.randomUUID().split("-")[0];

  // TODO 7: guarda en KV con metadata y devuelve { id } con status 201
});

// ============================================
// PUT /catalog/:id — actualiza e invalida caché
// ============================================
app.put("/catalog/:id", zValidator("json", itemSchema), async (c) => {
  const id   = c.req.param("id");
  const data = c.req.valid("json");

  // TODO 8: actualiza en KV
  //   CATALOG_KV.put(`catalog:${id}`, JSON.stringify({ ...data, id }), { metadata: {...} })
  //   invalida la caché del detalle: caches.default.delete(c.req.raw)
  //   invalida también el listado: caches.default.delete(new URL("/catalog", c.req.url).toString())
  //   devuelve c.json({ updated: id })
});

// ============================================
// DELETE /catalog/:id — elimina e invalida caché
// ============================================
app.delete("/catalog/:id", async (c) => {
  const id = c.req.param("id");

  // TODO 9: CATALOG_KV.delete(`catalog:${id}`)
  //   invalida caché del ítem y del listado
  //   devuelve c.json({ deleted: id })
});

// ============================================
// DELETE /cache/catalog — purga manual del listado
// ============================================
app.delete("/cache/catalog", async (c) => {
  const listUrl = new URL("/catalog", c.req.url).toString();
  const deleted = await caches.default.delete(listUrl);
  return c.json({ purged: deleted, url: listUrl });
});

// ============================================
// GET /health — estado del Worker
// ============================================
app.get("/health", (c) => c.json({ status: "ok", timestamp: Date.now() }));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
