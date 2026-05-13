import { Hono }          from "hono";
import { zValidator }    from "@hono/zod-validator";
import { z }             from "zod";
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

const GAMES: Game[] = [
  { id: 1,  title: "The Witcher 3: Wild Hunt",      price: 29.99, genre: "rpg",       platform: "pc",     publisher: "CD Projekt Red", year: 2015, rating: 9.8 },
  { id: 2,  title: "Elden Ring",                    price: 59.99, genre: "rpg",       platform: "ps5",    publisher: "FromSoftware",   year: 2022, rating: 9.6 },
  { id: 3,  title: "Half-Life: Alyx",               price: 49.99, genre: "fps",       platform: "pc",     publisher: "Valve",          year: 2020, rating: 9.3 },
  { id: 4,  title: "Civilization VII",              price: 49.99, genre: "strategy",  platform: "pc",     publisher: "2K Games",       year: 2025, rating: 8.5 },
  { id: 5,  title: "FIFA 25",                       price: 39.99, genre: "sports",    platform: "ps5",    publisher: "EA Sports",      year: 2024, rating: 7.8 },
  { id: 6,  title: "Zelda: Tears of the Kingdom",  price: 59.99, genre: "adventure", platform: "switch", publisher: "Nintendo",       year: 2023, rating: 9.7 },
  { id: 7,  title: "Hades II",                      price: 24.99, genre: "rpg",       platform: "pc",     publisher: "Supergiant",     year: 2024, rating: 9.1 },
  { id: 8,  title: "Doom: The Dark Ages",           price: 59.99, genre: "fps",       platform: "xbox",   publisher: "Bethesda",       year: 2025, rating: 8.9 },
  { id: 9,  title: "Balatro",                       price: 14.99, genre: "puzzle",    platform: "pc",     publisher: "LocalThunk",     year: 2024, rating: 9.4 },
  { id: 10, title: "Monster Hunter Wilds",          price: 59.99, genre: "rpg",       platform: "ps5",    publisher: "Capcom",         year: 2025, rating: 9.0 },
  { id: 11, title: "Age of Mythology: Retold",      price: 29.99, genre: "strategy",  platform: "pc",     publisher: "Xbox Studio",    year: 2024, rating: 8.2 },
  { id: 12, title: "F1 25",                         price: 49.99, genre: "sports",    platform: "ps5",    publisher: "Codemasters",    year: 2025, rating: 8.0 },
];

const PUBLISHERS: Publisher[] = [
  { id: 1, name: "CD Projekt Red", country: "Polonia", founded: 1994 },
  { id: 2, name: "FromSoftware",   country: "Japón",   founded: 1986 },
  { id: 3, name: "Valve",          country: "EEUU",    founded: 1996 },
  { id: 4, name: "Nintendo",       country: "Japón",   founded: 1889 },
  { id: 5, name: "Capcom",         country: "Japón",   founded: 1979 },
  { id: 6, name: "Supergiant",     country: "EEUU",    founded: 2009 },
  { id: 7, name: "Bethesda",       country: "EEUU",    founded: 1986 },
  { id: 8, name: "2K Games",       country: "EEUU",    founded: 2005 },
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

const gamesQuerySchema = z.object({
  genre:    z.string().optional(),
  platform: z.string().optional(),
  limit:    z.coerce.number().int().min(1).max(50).default(20),
  page:     z.coerce.number().int().min(1).default(1),
});

// ============================================
// PASO 3: publishersRouter
// ============================================

const publishersRouter = new Hono<{ Bindings: Env }>();

publishersRouter.get("/", (c) => {
  return c.json({ publishers: PUBLISHERS, total: PUBLISHERS.length });
});

publishersRouter.get("/:id", (c) => {
  const rawId = c.req.param("id");
  if (!/^\d+$/.test(rawId)) {
    throw new HTTPException(400, { message: "El id debe ser un número entero positivo" });
  }
  const id        = Number(rawId);
  const publisher = PUBLISHERS.find((p) => p.id === id);
  if (!publisher) {
    throw new HTTPException(404, { message: `Publisher con id ${id} no encontrado` });
  }
  return c.json(publisher);
});

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
// PASO 4: GET /games con zValidator("query")
// ============================================

app.get(
  "/games",
  zValidator("query", gamesQuerySchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Parámetros de consulta inválidos", details: result.error.issues }, 422);
    }
  }),
  (c) => {
    const { genre, platform, limit, page } = c.req.valid("query");

    let filtered = GAMES;
    if (genre)    filtered = filtered.filter((g) => g.genre    === genre);
    if (platform) filtered = filtered.filter((g) => g.platform === platform);

    const total  = filtered.length;
    const offset = (page - 1) * limit;
    const games  = filtered.slice(offset, offset + limit);

    return c.json({ games, total, page, limit });
  }
);

// ============================================
// PASO 1: GET /games/:id con validación de param
// ============================================

app.get("/games/:id", (c) => {
  const rawId = c.req.param("id");
  if (!/^\d+$/.test(rawId)) {
    throw new HTTPException(400, { message: "El id debe ser un número entero positivo" });
  }
  const id   = Number(rawId);
  const game = GAMES.find((g) => g.id === id);
  if (!game) {
    throw new HTTPException(404, { message: `Juego con id ${id} no encontrado` });
  }
  return c.json(game);
});

// ============================================
// PASO 2: POST /games con zValidator("json")
// ============================================

app.post(
  "/games",
  zValidator("json", createGameSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: "Datos inválidos", details: result.error.issues }, 422);
    }
  }),
  (c) => {
    const data    = c.req.valid("json");
    const newGame = { ...data, id: Date.now(), rating: data.rating ?? 0 };
    GAMES.push(newGame);
    return c.json(newGame, 201);
  }
);

// ============================================
// PASO 3: Montar publishersRouter
// ============================================

app.route("/publishers", publishersRouter);

app.get("/health", (c) => c.json({ status: "ok", games: GAMES.length }));

app.notFound((c) => c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404));

export default app;
