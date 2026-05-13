// ============================================
// PROYECTO SEMANA 03: API REST con JWT
// Semana 03 — HTTP Avanzado y Routing con Hono
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Renombra "Item" y "items" por el recurso de tu dominio.
// Ejemplos según dominio:
//   Clínica veterinaria → Animal / animals
//   Escape room         → Room / rooms
//   Biblioteca          → Book / books
//   Marina deportiva    → Boat / boats

import { Hono }          from "hono";
import { sign, verify }  from "hono/jwt";
import { zValidator }    from "@hono/zod-validator";
import { z }             from "zod";
import { HTTPException } from "hono/http-exception";
import type { Context, Next } from "hono";

// ============================================
// TODO 1: Define los tipos de tu dominio
// Renombra "Item" por el recurso de tu dominio
// Añade los campos específicos de tu dominio
// ============================================

export interface Env {
  JWT_SECRET: string;
}

interface Item {
  id:          number;
  name:        string;
  description: string;
  category:    string;
  // TODO: añade campos específicos de tu dominio
}

// TODO 2: Declara Variables con jwtPayload tipado
type Variables = {};

// ============================================
// TODO 3: Define al menos 10 ítems iniciales
// con datos realistas de tu dominio
// ============================================

const ITEMS: Item[] = [
  // TODO: reemplaza estos ejemplos con datos de tu dominio
  { id: 1,  name: "Ítem 1",  description: "Descripción 1",  category: "A" },
  { id: 2,  name: "Ítem 2",  description: "Descripción 2",  category: "B" },
  { id: 3,  name: "Ítem 3",  description: "Descripción 3",  category: "A" },
  { id: 4,  name: "Ítem 4",  description: "Descripción 4",  category: "C" },
  { id: 5,  name: "Ítem 5",  description: "Descripción 5",  category: "B" },
  { id: 6,  name: "Ítem 6",  description: "Descripción 6",  category: "A" },
  { id: 7,  name: "Ítem 7",  description: "Descripción 7",  category: "C" },
  { id: 8,  name: "Ítem 8",  description: "Descripción 8",  category: "B" },
  { id: 9,  name: "Ítem 9",  description: "Descripción 9",  category: "A" },
  { id: 10, name: "Ítem 10", description: "Descripción 10", category: "C" },
];

// Usuarios de prueba — contraseñas en texto plano solo para desarrollo
const USERS = [
  { id: 1, username: "manager", password: "manager123", role: "admin" as const },
  { id: 2, username: "staff",   password: "staff456",   role: "user"  as const },
];

// ============================================
// TODO 4: Crea el middleware requireAuth
// Hint: extrae el header "Authorization: Bearer <token>"
// Usa await verify(token, c.env.JWT_SECRET)
// Guarda el payload con c.set("jwtPayload", payload)
// Si falla → throw new HTTPException(401)
// ============================================

const requireAuth = async (
  _c: Context<{ Bindings: Env; Variables: Variables }>,
  _next: Next
): Promise<Response | void> => {
  // TODO: implementar
  throw new HTTPException(401, { message: "Middleware no implementado" });
};

// ============================================
// TODO 5: Schema Zod para crear un ítem
// Adapta los campos a tu dominio
// Hint: z.string().min(1).max(200), z.number().positive(), z.enum([...])
// ============================================

const createItemSchema = z.object({
  name:        z.string().min(1).max(200),
  description: z.string().min(1),
  category:    z.string().min(1),
  // TODO: añade campos específicos de tu dominio con validaciones
});

// ============================================
// TODO 6: catalogRouter — rutas PÚBLICAS
// GET /items — lista todos los ítems
//   Hint: soporta query param ?category= con c.req.query("category")
// GET /items/:id — obtiene un ítem por id
//   Hint: valida que el id sea numérico antes de buscar
// ============================================

const catalogRouter = new Hono<{ Bindings: Env }>();

catalogRouter.get("/", (c) => {
  // TODO: implementar con filtro opcional por category
  return c.json({ items: ITEMS, total: ITEMS.length });
});

catalogRouter.get("/:id", (c) => {
  // TODO: implementar búsqueda por id con validación numérica
  return c.json({});
});

// ============================================
// TODO 7: protectedRouter — rutas que REQUIEREN token
// POST /items — crea un ítem con zValidator("json", createItemSchema)
//   Hint: usa requireAuth como middleware + zValidator como segundo middleware
// DELETE /items/:id — elimina un ítem
//   Hint: verifica que el ítem existe antes de eliminar
// ============================================

const protectedRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

protectedRouter.post(
  "/",
  requireAuth,
  // TODO: añade zValidator("json", createItemSchema) con error 422
  (c) => {
    // TODO: implementar usando c.req.valid("json")
    return c.json({}, 201);
  }
);

protectedRouter.delete("/:id", requireAuth, (c) => {
  // TODO: implementar eliminación con validación de existencia
  return c.json({ deleted: null });
});

// ============================================
// App principal
// ============================================

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
  console.error("[ERROR]", err);
  return c.json({ error: "Error interno del servidor" }, 500);
});

// TODO 8: Ruta de login
// POST /auth/login con zValidator("json", loginSchema)
// Genera el token con await sign(payload, c.env.JWT_SECRET)
// El payload debe incluir: sub, username, role, exp (1 hora)

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

app.post(
  "/auth/login",
  zValidator("json", loginSchema, (result, c) => {
    if (!result.success) return c.json({ error: "username y password requeridos" }, 400);
  }),
  async (c) => {
    // TODO: busca el usuario, genera el token y devuelve { token }
    return c.json({ error: "No implementado" }, 501);
  }
);

// TODO 9: Monta los routers con app.route()
// Hint: app.route("/items", catalogRouter)
//       app.route("/items", protectedRouter)
// Ambos pueden usar el mismo prefijo /items — Hono selecciona el handler correcto

app.get("/health", (c) => c.json({ status: "ok", items: ITEMS.length }));

app.notFound((c) => c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404));

export default app;
