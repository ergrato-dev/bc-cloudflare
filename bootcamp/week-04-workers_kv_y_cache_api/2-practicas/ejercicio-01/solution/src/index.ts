import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

// ============================================
// TIPOS Y BINDINGS
// ============================================

type Env = {
  COMICS_KV: KVNamespace;
};

type Comic = {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  available: boolean;
};

type ComicMeta = {
  genre: string;
  available: boolean;
};

const comicSchema = z.object({
  title: z.string().min(1).max(120),
  author: z.string().min(1).max(80),
  genre: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  available: z.boolean(),
});

const SEED_COMICS: Comic[] = [
  { id: "1",  title: "Watchmen",                author: "Alan Moore",       genre: "superhero",     year: 1986, available: true },
  { id: "2",  title: "Maus",                    author: "Art Spiegelman",   genre: "biography",     year: 1986, available: true },
  { id: "3",  title: "Batman: The Dark Knight", author: "Frank Miller",     genre: "superhero",     year: 1986, available: false },
  { id: "4",  title: "Persepolis",              author: "Marjane Satrapi",  genre: "biography",     year: 2000, available: true },
  { id: "5",  title: "V for Vendetta",          author: "Alan Moore",       genre: "dystopia",      year: 1982, available: true },
  { id: "6",  title: "From Hell",               author: "Alan Moore",       genre: "thriller",      year: 1989, available: false },
  { id: "7",  title: "Sandman Vol. 1",          author: "Neil Gaiman",      genre: "fantasy",       year: 1989, available: true },
  { id: "8",  title: "Akira Vol. 1",            author: "Katsuhiro Otomo",  genre: "sci-fi",        year: 1982, available: true },
  { id: "9",  title: "Ghost World",             author: "Daniel Clowes",    genre: "slice-of-life", year: 1993, available: true },
  { id: "10", title: "Blankets",                author: "Craig Thompson",   genre: "memoir",        year: 2003, available: false },
  { id: "11", title: "Y: The Last Man",         author: "Brian K. Vaughan", genre: "sci-fi",        year: 2002, available: true },
  { id: "12", title: "Saga Vol. 1",             author: "Brian K. Vaughan", genre: "sci-fi",        year: 2012, available: true },
];

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 1: Seed — precarga cómics en KV
// ============================================
app.post("/seed", async (c) => {
  // Parallelizamos todos los puts para minimizar latencia
  await Promise.all(
    SEED_COMICS.map((comic) =>
      c.env.COMICS_KV.put(
        `comics:${comic.id}`,
        JSON.stringify(comic),
        {
          metadata: { genre: comic.genre, available: comic.available },
          expirationTtl: 86400,
        }
      )
    )
  );
  return c.json({ seeded: SEED_COMICS.length });
});

// ============================================
// PASO 2: Listar cómics (con filtro por genre)
// ============================================
app.get("/comics", async (c) => {
  const genre = c.req.query("genre");

  // KV.list devuelve las llaves con metadata sin cargar los valores
  const list = await c.env.COMICS_KV.list<ComicMeta>({ prefix: "comics:", limit: 50 });

  const filteredKeys = genre
    ? list.keys.filter((k) => k.metadata?.genre === genre)
    : list.keys;

  // Cargamos los valores solo de las llaves filtradas en paralelo
  const comics = await Promise.all(
    filteredKeys.map((k) => c.env.COMICS_KV.get<Comic>(k.name, { type: "json" }))
  );

  return c.json({ comics: comics.filter(Boolean), total: comics.length });
});

// ============================================
// PASO 3: Obtener un cómic por ID
// ============================================
app.get("/comics/:id", async (c) => {
  const id    = c.req.param("id");
  const comic = await c.env.COMICS_KV.get<Comic>(`comics:${id}`, { type: "json" });

  if (!comic) {
    throw new HTTPException(404, { message: "Comic not found" });
  }
  return c.json(comic);
});

// ============================================
// PASO 4: Crear un nuevo cómic
// ============================================
app.post("/comics", zValidator("json", comicSchema), async (c) => {
  const data  = c.req.valid("json");
  const id    = crypto.randomUUID().split("-")[0];
  const comic: Comic = { ...data, id };

  await c.env.COMICS_KV.put(
    `comics:${id}`,
    JSON.stringify(comic),
    { metadata: { genre: data.genre, available: data.available } }
  );

  return c.json({ id }, 201);
});

// ============================================
// PASO 5: Eliminar un cómic
// ============================================
app.delete("/comics/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.COMICS_KV.delete(`comics:${id}`);
  return c.json({ deleted: id });
});

// Manejo global de errores HTTP
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
