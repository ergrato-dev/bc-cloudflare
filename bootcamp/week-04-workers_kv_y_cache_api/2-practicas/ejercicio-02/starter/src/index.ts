import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

// ============================================
// TIPOS — Sin Bindings (solo Cache API)
// ============================================

type Country = {
  code: string;
  name: string;
  continent: string;
  capital: string;
  population: number;
  language: string;
};

// Datos estáticos del directorio (mínimo 15 ítems — Etapa 0)
const COUNTRIES: Country[] = [
  { code: "es", name: "España",          continent: "Europa",        capital: "Madrid",       population: 47_300_000, language: "Español"   },
  { code: "fr", name: "Francia",         continent: "Europa",        capital: "París",        population: 68_000_000, language: "Francés"   },
  { code: "de", name: "Alemania",        continent: "Europa",        capital: "Berlín",       population: 84_000_000, language: "Alemán"    },
  { code: "it", name: "Italia",          continent: "Europa",        capital: "Roma",         population: 59_000_000, language: "Italiano"  },
  { code: "pt", name: "Portugal",        continent: "Europa",        capital: "Lisboa",       population: 10_300_000, language: "Portugués" },
  { code: "mx", name: "México",          continent: "América Norte", capital: "Ciudad de México", population: 128_000_000, language: "Español" },
  { code: "co", name: "Colombia",        continent: "América Sur",   capital: "Bogotá",       population: 52_000_000, language: "Español"   },
  { code: "ar", name: "Argentina",       continent: "América Sur",   capital: "Buenos Aires", population: 46_000_000, language: "Español"   },
  { code: "br", name: "Brasil",          continent: "América Sur",   capital: "Brasilia",     population: 215_000_000, language: "Portugués" },
  { code: "us", name: "Estados Unidos",  continent: "América Norte", capital: "Washington DC", population: 335_000_000, language: "Inglés"   },
  { code: "jp", name: "Japón",           continent: "Asia",          capital: "Tokio",        population: 125_000_000, language: "Japonés"   },
  { code: "cn", name: "China",           continent: "Asia",          capital: "Pekín",        population: 1_410_000_000, language: "Mandarín" },
  { code: "kr", name: "Corea del Sur",   continent: "Asia",          capital: "Seúl",         population: 51_700_000, language: "Coreano"   },
  { code: "in", name: "India",           continent: "Asia",          capital: "Nueva Delhi",  population: 1_420_000_000, language: "Hindi"   },
  { code: "za", name: "Sudáfrica",       continent: "África",        capital: "Pretoria",     population: 60_000_000, language: "Zulú/Inglés" },
];

const app = new Hono();

// ============================================
// PASO 1–2: Listar todos los países
//           con caché HIT/MISS (5 minutos)
// ============================================
// Ruta: GET /countries
app.get("/countries", async (c) => {
  const cache    = caches.default;
  // Hint: la clave de caché debe ser el Request nativo, no c.req
  const cacheKey = c.req.raw;

  // TODO (Paso 1): intenta recuperar la respuesta cacheada
  //   const cached = await cache.match(cacheKey);
  //   si existe, devuelve `cached` directamente (HIT)

  // TODO (Paso 2): construye la respuesta con los datos frescos
  //   new Response(JSON.stringify({ countries: COUNTRIES }), {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Cache-Control": "public, max-age=300",
  //       "X-Cache": "MISS",
  //     },
  //   })
  //   Guarda en caché con: c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()))
  //   devuelve la respuesta
});

// ============================================
// PASO 3: Obtener un país por código
//         con caché HIT/MISS (10 minutos)
// ============================================
// Ruta: GET /countries/:code
app.get("/countries/:code", async (c) => {
  const code     = c.req.param("code").toLowerCase();
  const cache    = caches.default;
  const cacheKey = c.req.raw;

  // TODO (Paso 3 — HIT):
  //   const cached = await cache.match(cacheKey);
  //   si existe, devuelve `cached`

  const country = COUNTRIES.find((ct) => ct.code === code);

  if (!country) {
    throw new HTTPException(404, { message: "Country not found" });
  }

  // TODO (Paso 3 — MISS): construye respuesta con max-age=600
  //   guarda con waitUntil y devuelve
});

// ============================================
// PASO 4: Purgar caché de /countries
// ============================================
// Ruta: DELETE /cache/countries
app.delete("/cache/countries", async (c) => {
  // TODO: construye la URL del recurso a purgar
  //   const listUrl = new URL("/countries", c.req.url).toString();
  //   const deleted = await caches.default.delete(listUrl);
  //   devuelve c.json({ purged: deleted, url: listUrl })
});

// ============================================
// Health check — nunca cacheado
// ============================================
app.get("/health", (c) => c.json({ status: "ok", timestamp: Date.now() }));

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
