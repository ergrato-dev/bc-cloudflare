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

type Variables = { jwtPayload: JWTPayload };

// ============================================
// Datos en memoria (sin base de datos)
// ============================================

interface User {
  id: number;
  username: string;
  password: string;
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
// Middleware requireAuth
// ============================================

const requireAuth = async (
  c: Context<{ Bindings: Env; Variables: Variables }>,
  next: Next
): Promise<Response | void> => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Token requerido. Cabecera: Authorization: Bearer <token>" });
  }

  const token = authHeader.slice(7);
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("jwtPayload", payload as JWTPayload);
    await next();
  } catch {
    throw new HTTPException(401, { message: "Token inválido o expirado" });
  }
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
// Rutas públicas — /auth
// ============================================

app.post(
  "/auth/login",
  zValidator("json", loginSchema, (result, c) => {
    if (!result.success) return c.json({ error: "username y password requeridos" }, 400);
  }),
  async (c) => {
    const { username, password } = c.req.valid("json");
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) return c.json({ error: "Credenciales inválidas" }, 401);

    const payload: JWTPayload = {
      sub:      String(user.id),
      username: user.username,
      role:     user.role,
      exp:      Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
    };
    const token = await sign(payload, c.env.JWT_SECRET);
    return c.json({ token });
  }
);

app.get("/auth/me", requireAuth, (c) => {
  const { sub, username, role } = c.get("jwtPayload");
  return c.json({ user: { id: Number(sub), username, role } });
});

// ============================================
// Rutas protegidas — /notes
// ============================================

app.get("/notes", requireAuth, (c) => {
  const { sub } = c.get("jwtPayload");
  const userNotes = NOTES.filter((n) => n.userId === Number(sub));
  return c.json({ notes: userNotes, total: userNotes.length });
});

app.post(
  "/notes",
  requireAuth,
  zValidator("json", createNoteSchema, (result, c) => {
    if (!result.success) return c.json({ error: "Datos inválidos", details: result.error.issues }, 422);
  }),
  (c) => {
    const { sub }    = c.get("jwtPayload");
    const { title, content } = c.req.valid("json");
    const newNote: Note = {
      id:        Date.now(),
      userId:    Number(sub),
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    NOTES.push(newNote);
    return c.json(newNote, 201);
  }
);

app.delete("/notes/:id", requireAuth, (c) => {
  const { sub }  = c.get("jwtPayload");
  const noteId   = Number(c.req.param("id"));
  const index    = NOTES.findIndex((n) => n.id === noteId && n.userId === Number(sub));
  if (index === -1) {
    throw new HTTPException(404, { message: `Nota con id ${noteId} no encontrada` });
  }
  const deleted = NOTES.splice(index, 1)[0];
  return c.json({ deleted });
});

app.get("/health", (c) => c.json({ status: "ok", notes: NOTES.length }));

app.notFound((c) => c.json({ error: "Ruta no encontrada", path: new URL(c.req.url).pathname }, 404));

export default app;
