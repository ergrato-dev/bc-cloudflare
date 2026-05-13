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

// Metadata ligera guardada junto a cada llave (≤ 1 024 B)
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

// Catálogo inicial para cargar en KV (mínimo 12 ítems — Etapa 0)
const SEED_COMICS: Comic[] = [
  { id: "1",  title: "Watchmen",                author: "Alan Moore",       genre: "superhero", year: 1986, available: true },
  { id: "2",  title: "Maus",                    author: "Art Spiegelman",   genre: "biography", year: 1986, available: true },
  { id: "3",  title: "Batman: The Dark Knight", author: "Frank Miller",     genre: "superhero", year: 1986, available: false },
  { id: "4",  title: "Persepolis",              author: "Marjane Satrapi",  genre: "biography", year: 2000, available: true },
  { id: "5",  title: "V for Vendetta",          author: "Alan Moore",       genre: "dystopia",  year: 1982, available: true },
  { id: "6",  title: "From Hell",               author: "Alan Moore",       genre: "thriller",  year: 1989, available: false },
  { id: "7",  title: "Sandman Vol. 1",          author: "Neil Gaiman",      genre: "fantasy",   year: 1989, available: true },
  { id: "8",  title: "Akira Vol. 1",            author: "Katsuhiro Otomo",  genre: "sci-fi",    year: 1982, available: true },
  { id: "9",  title: "Ghost World",             author: "Daniel Clowes",    genre: "slice-of-life", year: 1993, available: true },
  { id: "10", title: "Blankets",                author: "Craig Thompson",   genre: "memoir",    year: 2003, available: false },
  { id: "11", title: "Y: The Last Man",         author: "Brian K. Vaughan", genre: "sci-fi",    year: 2002, available: true },
  { id: "12", title: "Saga Vol. 1",             author: "Brian K. Vaughan", genre: "sci-fi",    year: 2012, available: true },
];

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 1: Seed — precarga cómics en KV
// ============================================
// Ruta: POST /seed
// Cada cómic se guarda con llave "comics:{id}", valor JSON,
// metadata { genre, available } y TTL de 86 400 segundos.
app.post("/seed", async (c) => {
  // TODO: Itera SEED_COMICS y guarda cada uno en COMICS_KV con:
  //   - llave: `comics:${comic.id}`
  //   - valor: JSON.stringify(comic)
  //   - opciones: { metadata: { genre, available }, expirationTtl: 86400 }
  // Hint: usa Promise.all para paralelizar los puts
  // TODO: devuelve c.json({ seeded: SEED_COMICS.length })
});

// ============================================
// PASO 2: Listar cómics (con filtro opcional por genre)
// ============================================
// Ruta: GET /comics?genre=sci-fi
// Usa KV.list({ prefix: "comics:", limit: 50 }) y filtra en metadata
app.get("/comics", async (c) => {
  const genre = c.req.query("genre");

  // TODO: llama a c.env.COMICS_KV.list<ComicMeta>({ prefix: "comics:", limit: 50 })
  // TODO: si genre está definido, filtra list.keys por k.metadata?.genre === genre
  // TODO: lee los valores filtrados con Promise.all + KV.get(k.name, { type: "json" })
  // TODO: devuelve c.json({ comics: [...], total: n })
});

// ============================================
// PASO 3: Obtener un cómic por ID
// ============================================
// Ruta: GET /comics/:id
app.get("/comics/:id", async (c) => {
  const id = c.req.param("id");

  // TODO: recupera el cómic con c.env.COMICS_KV.get<Comic>(`comics:${id}`, { type: "json" })
  // TODO: si el resultado es null, lanza new HTTPException(404, { message: "Comic not found" })
  // TODO: devuelve c.json(comic)
});

// ============================================
// PASO 4: Crear un nuevo cómic
// ============================================
// Ruta: POST /comics
app.post("/comics", zValidator("json", comicSchema), async (c) => {
  const data = c.req.valid("json");
  const id   = crypto.randomUUID().split("-")[0];
  const comic: Comic = { ...data, id };

  // TODO: guarda con c.env.COMICS_KV.put(
  //   `comics:${id}`,
  //   JSON.stringify(comic),
  //   { metadata: { genre: data.genre, available: data.available } }
  // )
  // TODO: devuelve c.json({ id }, 201)
});

// ============================================
// PASO 5: Eliminar un cómic
// ============================================
// Ruta: DELETE /comics/:id
app.delete("/comics/:id", async (c) => {
  const id = c.req.param("id");

  // TODO: llama a c.env.COMICS_KV.delete(`comics:${id}`)
  // TODO: devuelve c.json({ deleted: id })
});

// Manejo global de errores HTTP
app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse();
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
