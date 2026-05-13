# Ejercicio 02 — Autenticación con JWT

Construirás una **API de notas protegida** con autenticación JWT.
Los endpoints de notas requieren un token válido; login es público.

---

## Contexto

La API tiene dos zonas: pública (`/auth`) y protegida (`/notes`).
El starter tiene los datos y el esqueleto de rutas pero sin la lógica de JWT.
Tu misión: implementar login con `sign`, middleware con `verify`, y pasar el
payload al handler mediante `c.set` / `c.get`.

---

### Paso 1: Generar el token en login

Al recibir credenciales válidas, genera un JWT con `sign` de `hono/jwt`:

```typescript
import { sign } from "hono/jwt";

app.post("/auth/login", async (c) => {
  const { username, password } = await c.req.json();
  const user = USERS.find((u) => u.username === username && u.password === password);
  if (!user) return c.json({ error: "Credenciales inválidas" }, 401);

  const payload = {
    sub:      String(user.id),
    username: user.username,
    role:     user.role,
    exp:      Math.floor(Date.now() / 1000) + 60 * 60, // 1 hora
  };
  const token = await sign(payload, c.env.JWT_SECRET);
  return c.json({ token });
});
```

**Abre `starter/src/index.ts`** y completa el TODO del Paso 1.

---

### Paso 2: Middleware de verificación

El middleware extrae el token del header `Authorization: Bearer <token>`
y lo verifica con `verify`:

```typescript
import { verify } from "hono/jwt";

// Middleware manual — soporta secret dinámico desde c.env
const requireAuth = async (c: Context<{ Bindings: Env; Variables: Variables }>, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "Token requerido" });
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
```

**Completa el TODO del Paso 2** — implementa el middleware `requireAuth`.

---

### Paso 3: Rutas protegidas de notas

Las rutas bajo `/notes` usan `requireAuth` como middleware:

```typescript
// c.get("jwtPayload") está tipado gracias a type Variables
app.get("/notes", requireAuth, (c) => {
  const { sub } = c.get("jwtPayload");
  const userNotes = NOTES.filter((n) => n.userId === Number(sub));
  return c.json({ notes: userNotes, total: userNotes.length });
});

app.delete("/notes/:id", requireAuth, async (c) => {
  const { sub } = c.get("jwtPayload");
  const noteId  = Number(c.req.param("id"));
  const index   = NOTES.findIndex((n) => n.id === noteId && n.userId === Number(sub));
  if (index === -1) throw new HTTPException(404, { message: "Nota no encontrada" });
  const deleted = NOTES.splice(index, 1)[0];
  return c.json({ deleted });
});
```

**Completa el TODO del Paso 3** — implementa `GET /notes`, `POST /notes` y `DELETE /notes/:id`.

---

### Paso 4: Probar el Worker

```bash
cd starter
pnpm install
wrangler dev
```

```bash
# 1. Login — obtener token
TOKEN=$(curl -s -X POST http://localhost:8787/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"ana","password":"password123"}' | jq -r .token)

# 2. Listar notas (requiere token)
curl -H "Authorization: Bearer $TOKEN" http://localhost:8787/notes

# 3. Crear nota
curl -X POST http://localhost:8787/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Aprender JWT","content":"sign, verify, exp"}'

# 4. Sin token → debe devolver 401
curl http://localhost:8787/notes

# 5. Token manipulado → debe devolver 401
curl -H "Authorization: Bearer token.invalido.aqui" http://localhost:8787/notes
```
