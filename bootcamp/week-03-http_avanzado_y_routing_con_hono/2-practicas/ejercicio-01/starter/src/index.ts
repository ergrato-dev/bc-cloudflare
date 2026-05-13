import { Hono }       from "hono";
import { zValidator } from "@hono/zod-validator";
import { z }          from "zod";
import { HTTPException } from "hono/http-exception";

export interface Env {}

type Genre    = "rpg" | "fps" | "strategy" | "sports" | "adventure" | "puzzle";
type Platform = "pc" | "ps5" | "xbox" | "switch";

interface Game {
  id: number;
  title: string;
  price: number;
  genre: Genre;
  platform: Platform;
  publisher: string;
  year: number;
  rating: number;
}

interface Publisher {
  id: number;
  name: string;
  country: string;
  founded: number;
}

// Catálogo de juegos — mínimo 10 ítems
const GAMES: Game[] = [
  { id: 1,  title: "The Witcher 3: Wild Hunt",  price: 29.99, genre: "rpg",       platform: "pc",     publisher: "CD Projekt Red", year: 2015, rating: 9.8 },
  { id: 2,  title: "Elden Ring",                price: 59.99, genre: "rpg",       platform: "ps5",    publisher: "FromSoftware",   year: 2022, rating: 9.6 },
  { id: 3,  title: "Half-Life: Alyx",           price: 49.99, genre: "fps",       platform: "pc",     publisher: "Valve",          year: 2020, rating: 9.3 },
  { id: 4,  title: "Civilization VII",          price: 49.99, genre: "strategy",  platform: "pc",     publisher: "2K Games",       year: 2025, rating: 8.5 },
  { id: 5,  title: "FIFA 25",                   price: 39.99, genre: "sports",    platform: "ps5",    publisher: "EA Sports",      year: 2024, rating: 7.8 },
  { id: 6,  title: "Zelda: Tears of the Kingdom", price: 59.99, genre: "adventure", platform: "switch", publisher: "Nintendo",    year: 2023, rating: 9.7 },
  { id: 7,  title: "Hades II",                  price: 24.99, genre: "rpg",       platform: "pc",     publisher: "Supergiant",     year: 2024, rating: 9.1 },
  { id: 8,  title: "Doom: The Dark Ages",       price: 59.99, genre: "fps",       platform: "xbox",   publisher: "Bethesda",       year: 2025, rating: 8.9 },
  { id: 9,  title: "Balatro",                   price: 14.99, genre: "puzzle",    platform: "pc",     publisher: "LocalThunk",     year: 2024, rating: 9.4 },
  { id: 10, title: "Monster Hunter Wilds",      price: 59.99, genre: "rpg",       platform: "ps5",    publisher: "Capcom",         year: 2025, rating: 9.0 },
  { id: 11, title: "Age of Mythology: Retold",  price: 29.99, genre: "strategy",  platform: "pc",     publisher: "Xbox Studio",    year: 2024, rating: 8.2 },
  { id: 12, title: "F1 25",                     price: 49.99, genre: "sports",    platform: "ps5",    publisher: "Codemasters",    year: 2025, rating: 8.0 },
];

const PUBLISHERS: Publisher[] = [
  { id: 1, name: "CD Projekt Red", country: "Polonia",   founded: 1994 },
  { id: 2, name: "FromSoftware",   country: "Japón",     founded: 1986 },
  { id: 3, name: "Valve",          country: "EEUU",      founded: 1996 },
  { id: 4, name: "Nintendo",       country: "Japón",     founded: 1889 },
  { id: 5, name: "Capcom",         country: "Japón",     founded: 1979 },
  { id: 6, name: "Supergiant",     country: "EEUU",      founded: 2009 },
  { id: 7, name: "Bethesda",       country: "EEUU",      founded: 1986 },
  { id: 8, name: "2K Games",       country: "EEUU",      founded: 2005 },
];

// ============================================
// Schemas Zod
// ============================================

const createGameSchema = z.object({
  title:     z.string().min(2).max(100),
  price:     z.number().positive(),
  genre:     z.enum(["rpg", "fps", "strategy", "sports", "adventure", "puzzle"]),
  platform:  z.enum(["pc", "ps5", "xbox", "switch"]),
  publisher: z.string().min(1),
  year:      z.number().int().min(1970).max(2030),
  rating:    z.number().min(0).max(10).optional(),
});

// ============================================
// PASO 3: publishersRouter
// ============================================

// TODO: Crea un sub-router "publishersRouter" con new Hono<{ Bindings: Env }>()
// TODO: Añade GET / que devuelva { publishers: PUBLISHERS, total: number }
// TODO: Añade GET /:id que busque por id numérico y devuelva 404 si no existe

// ============================================
// App principal
// ============================================

const app = new Hono<{ Bindings: Env }>();

app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
  console.error("[ERROR]", err);
  return c.json({ error: "Error interno del servidor" }, 500);
});

// ============================================
// PASO 4: GET /games — con zValidator("query")
// ============================================

const gamesQuerySchema = z.object({
  genre:    z.string().optional(),
  platform: z.string().optional(),
  limit:    z.coerce.number().int().min(1).max(50).default(20),
  page:     z.coerce.number().int().min(1).default(1),
});

// TODO: Añade zValidator("query", gamesQuerySchema) como middleware de esta ruta
// TODO: Dentro del handler usa c.req.valid("query") para obtener los valores tipados
// TODO: Filtra GAMES por genre y platform si están presentes
// TODO: Aplica paginación: offset = (page - 1) * limit
app.get("/games", (c) => {
  // Implementar usando c.req.valid("query")
  return c.json({ games: GAMES, total: GAMES.length });
});

// ============================================
// PASO 1: GET /games/:id — path param
// ============================================

// TODO: Extrae el param "id" con c.req.param("id")
// TODO: Valida que sea numérico con /^\d+$/.test(rawId)
//       Si no → throw new HTTPException(400, { message: "..." })
// TODO: Busca en GAMES — si no existe → throw new HTTPException(404, ...)
app.get("/games/:id", (c) => {
  // TODO: implementar
  return c.json({});
});

// ============================================
// PASO 2: POST /games — con zValidator("json")
// ============================================

// TODO: Añade zValidator("json", createGameSchema, ...) con error handler
//       que devuelva { error: "Datos inválidos", details: result.error.issues } con status 422
// TODO: En el handler usa c.req.valid("json") para obtener los datos tipados
// TODO: Devuelve el nuevo juego con id generado con Date.now() y status 201
app.post("/games", (c) => {
  // TODO: implementar
  return c.json({}, 201);
});

// ============================================
// PASO 3: Montar publishersRouter
// ============================================

// TODO: app.route("/publishers", publishersRouter);

app.get("/health", (c) => c.json({ status: "ok", games: GAMES.length }));

app.notFound((c) => c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404));

export default app;
