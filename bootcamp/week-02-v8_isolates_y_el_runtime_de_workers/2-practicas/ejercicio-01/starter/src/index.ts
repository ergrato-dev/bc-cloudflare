import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

export interface Env {}

// Catálogo de libros de la biblioteca pública
const BOOKS = [
  { id: 1, title: "Cien años de soledad", author: "Gabriel García Márquez", year: 1967, genre: "Realismo mágico", available: true },
  { id: 2, title: "Don Quijote de la Mancha", author: "Miguel de Cervantes", year: 1605, genre: "Novela", available: false },
  { id: 3, title: "El amor en los tiempos del cólera", author: "Gabriel García Márquez", year: 1985, genre: "Realismo mágico", available: true },
  { id: 4, title: "Ficciones", author: "Jorge Luis Borges", year: 1944, genre: "Cuento", available: true },
  { id: 5, title: "Pedro Páramo", author: "Juan Rulfo", year: 1955, genre: "Realismo mágico", available: false },
  { id: 6, title: "La casa de los espíritus", author: "Isabel Allende", year: 1982, genre: "Realismo mágico", available: true },
  { id: 7, title: "Rayuela", author: "Julio Cortázar", year: 1963, genre: "Novela experimental", available: true },
  { id: 8, title: "El túnel", author: "Ernesto Sábato", year: 1948, genre: "Novela psicológica", available: false },
  { id: 9, title: "Conversación en la catedral", author: "Mario Vargas Llosa", year: 1969, genre: "Novela", available: true },
  { id: 10, title: "El coronel no tiene quien le escriba", author: "Gabriel García Márquez", year: 1961, genre: "Novela corta", available: true },
  { id: 11, title: "Los detectives salvajes", author: "Roberto Bolaño", year: 1998, genre: "Novela", available: true },
  { id: 12, title: "Sobre héroes y tumbas", author: "Ernesto Sábato", year: 1961, genre: "Novela", available: false },
];

const app = new Hono<{ Bindings: Env }>();

// ============================================
// PASO 1: Middleware de logging con timing
// ============================================

// TODO: Añade un middleware global usando app.use("*", ...)
// que registre: método HTTP, pathname, status y duración en ms
// Hint: usa Date.now() antes y después de await next()
// Hint: el status está disponible en c.res.status DESPUÉS de await next()

// ============================================
// PASO 3: Error handler global
// ============================================

// TODO: Registra app.onError ANTES de las rutas
// Si err es instanceof HTTPException → devuelve c.json({ error: err.message }, err.status)
// Si es cualquier otro error → console.error(...) y devuelve 500 con JSON genérico

// ============================================
// RUTAS (ya implementadas — no modificar)
// ============================================

// GET /books — listar todos los libros
app.get("/books", (c) => {
  const genre = c.req.query("genre");
  const available = c.req.query("available");

  let result = BOOKS;
  if (genre) result = result.filter((b) => b.genre.toLowerCase().includes(genre.toLowerCase()));
  if (available !== undefined) result = result.filter((b) => b.available === (available === "true"));

  return c.json({ books: result, total: result.length });
});

// GET /books/:id — obtener libro por ID
app.get("/books/:id", (c) => {
  const rawId = c.req.param("id");

  // ============================================
  // PASO 2: Validación con HTTPException
  // ============================================

  // TODO: Valida que rawId sea un número entero positivo
  // Si no lo es → throw new HTTPException(400, { message: "..." })
  // Hint: /^\d+$/.test(rawId) comprueba si es numérico

  const id = Number(rawId);
  const book = BOOKS.find((b) => b.id === id);

  // TODO: Si book es undefined → throw new HTTPException(404, { message: "..." })

  return c.json(book);
});

// GET /books/author/:name — buscar libros por autor
app.get("/books/author/:name", (c) => {
  const name = c.req.param("name").toLowerCase();
  const books = BOOKS.filter((b) => b.author.toLowerCase().includes(name));
  return c.json({ books, total: books.length });
});

// GET /health
app.get("/health", (c) => c.json({ status: "ok", books: BOOKS.length }));

// ============================================
// PASO 4: Not found handler
// ============================================

// TODO: Añade app.notFound que devuelva JSON con
// { error: "Ruta no encontrada", path: pathname }
// Hint: new URL(c.req.url).pathname

export default app;
