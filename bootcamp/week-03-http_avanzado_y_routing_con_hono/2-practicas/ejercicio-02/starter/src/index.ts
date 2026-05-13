import { Hono }          from "hono";
import { sign, verify }  from "hono/jwt";
import { zValidator }    from "@hono/zod-validator";
import { z }             from "zod";
import { HTTPException } from "hono/http-exception";
import type { Context, Next } from "hono";

// ============================================
// Tipos y bindings
// ============================================

export interface Env {
  JWT_SECRET: string;
}

interface JWTPayload {
  sub:      string;
  username: string;
  role:     "user" | "admin";
  exp:      number;
}

// TODO: Declara type Variables = { jwtPayload: JWTPayload }
// Esto permite que c.set / c.get estén tipados en toda la app

type Variables = {};

// ============================================
// Datos en memoria (sin base de datos)
// ============================================

interface User {
  id: number;
  username: string;
  password: string; // En producción usar hash — aquí plano para simplificar
  role: "user" | "admin";
}

interface Note {
  id:        number;
  userId:    number;
  title:     string;
  content:   string;
  createdAt: string;
}

const USERS: User[] = [
  { id: 1, username: "ana",    password: "password123", role: "user"  },
  { id: 2, username: "carlos", password: "secret456",   role: "user"  },
  { id: 3, username: "admin",  password: "adminPass!",  role: "admin" },
];

// Notas iniciales de prueba
const NOTES: Note[] = [
  { id: 1, userId: 1, title: "Recordatorio",         content: "Revisar Cloudflare Workers",        createdAt: "2025-01-10T09:00:00Z" },
  { id: 2, userId: 1, title: "Ideas proyecto",        content: "API de gestor de tareas con D1",    createdAt: "2025-01-11T14:30:00Z" },
  { id: 3, userId: 2, title: "Lista de compras",      content: "Leche, pan, huevos",                createdAt: "2025-01-12T10:00:00Z" },
  { id: 4, userId: 1, title: "Hono routing",          content: "app.route() y sub-routers",         createdAt: "2025-01-13T08:00:00Z" },
  { id: 5, userId: 2, title: "JWT notas",             content: "sign, verify, exp en segundos",     createdAt: "2025-01-14T11:00:00Z" },
  { id: 6, userId: 3, title: "Admin tasks",           content: "Revisar métricas de Workers",       createdAt: "2025-01-15T16:00:00Z" },
  { id: 7, userId: 1, title: "Hono RPC",              content: "hc<typeof app>() para type-safety", createdAt: "2025-01-16T09:30:00Z" },
  { id: 8, userId: 2, title: "Zod validation",        content: "zValidator('json', schema)",        createdAt: "2025-01-17T13:00:00Z" },
];

// ============================================
// Schemas Zod
// ============================================

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const createNoteSchema = z.object({
  title:   z.string().min(1).max(200),
  content: z.string().min(1),
});

// ============================================
// PASO 2: Middleware requireAuth
// ============================================

// TODO: Implementa la función requireAuth:
//   1. Extrae el header "Authorization" con c.req.header("Authorization")
//   2. Verifica que empiece con "Bearer " — si no → throw HTTPException(401)
//   3. Extrae el token: authHeader.slice(7)
//   4. Usa await verify(token, c.env.JWT_SECRET) en un try/catch
//   5. Si verify lanza error → throw HTTPException(401, { message: "Token inválido o expirado" })
//   6. Si es válido → c.set("jwtPayload", payload as JWTPayload)
//   7. Llama await next()
const requireAuth = async (
  _c: Context<{ Bindings: Env; Variables: Variables }>,
  _next: Next
): Promise<Response | void> => {
  // TODO: implementar
  throw new HTTPException(401, { message: "Middleware no implementado" });
};

// ============================================
// App principal
// ============================================

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

app.onError((err, c) => {
  if (err instanceof HTTPException) return c.json({ error: err.message }, err.status);
  console.error("[ERROR]", err);
  return c.json({ error: "Error interno del servidor" }, 500);
});

// ============================================
// PASO 1: Ruta pública de login
// ============================================

app.post(
  "/auth/login",
  zValidator("json", loginSchema, (result, c) => {
    if (!result.success) return c.json({ error: "username y password requeridos" }, 400);
  }),
  async (c) => {
    // TODO: Busca el usuario en USERS por username y password
    // Hint: USERS.find((u) => u.username === ... && u.password === ...)
    // Si no existe → return c.json({ error: "Credenciales inválidas" }, 401)
    //
    // TODO: Construye el payload:
    //   { sub: String(user.id), username, role, exp: Math.floor(Date.now() / 1000) + 3600 }
    //
    // TODO: Usa await sign(payload, c.env.JWT_SECRET) para generar el token
    // TODO: Devuelve { token } con status 200
    return c.json({ error: "No implementado" }, 501);
  }
);

// Ruta de registro — solo verifica que el username no existe (sin persistencia real)
app.get("/auth/me", requireAuth, (c) => {
  // TODO: Usa c.get("jwtPayload") para obtener los datos del usuario autenticado
  // Devuelve { user: { sub, username, role } }
  return c.json({ user: {} });
});

// ============================================
// PASO 3: Rutas protegidas de notas
// ============================================

// TODO: GET /notes — lista las notas del usuario autenticado
// Hint: filtra NOTES donde note.userId === Number(c.get("jwtPayload").sub)
app.get("/notes", requireAuth, (c) => {
  // TODO: implementar
  return c.json({ notes: [], total: 0 });
});

// TODO: POST /notes — crea una nota para el usuario autenticado
// Hint: usa zValidator("json", createNoteSchema)
// El id puede ser Date.now(), userId viene de c.get("jwtPayload").sub
app.post("/notes", requireAuth, async (c) => {
  // TODO: implementar
  return c.json({}, 201);
});

// TODO: DELETE /notes/:id — elimina una nota del usuario autenticado
// Hint: verifica que la nota pertenece al usuario antes de eliminar
// Si no existe o no es del usuario → HTTPException(404)
app.delete("/notes/:id", requireAuth, (c) => {
  // TODO: implementar
  return c.json({ deleted: null });
});

app.get("/health", (c) => c.json({ status: "ok", notes: NOTES.length }));

app.notFound((c) => c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404));

export default app;
