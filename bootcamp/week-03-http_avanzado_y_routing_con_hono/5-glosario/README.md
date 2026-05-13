# Glosario — Semana 03

> **HTTP Avanzado y Routing con Hono**

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## A

**app.route()**
Método de Hono que monta un sub-router en un prefijo de ruta.
`app.route("/users", usersRouter)` → todas las rutas de `usersRouter` quedan bajo `/users`.

---

## B

**Bearer token**
Esquema de autenticación HTTP donde el cliente envía el JWT en el header:
`Authorization: Bearer <token>`. El servidor verifica el token para autenticar.

---

## C

**c.get() / c.set()**
Métodos del contexto Hono para leer y escribir variables tipadas durante el ciclo de vida de una request.
Requiere declarar `type Variables` en el tipo de la app.

**Context Variables**
Ver `c.get() / c.set()`. Variables que viajan adjuntas al contexto de una request,
útiles para pasar el payload JWT del middleware al handler.

---

## H

**hc()**
Función del cliente RPC de Hono. `hc<typeof app>(baseUrl)` devuelve un cliente
con llamadas type-safe basadas en la definición del servidor.

**HTTPException**
Clase de Hono para lanzar errores HTTP semánticos.
`throw new HTTPException(404, { message: "No encontrado" })` interrumpe el flujo
y pasa el control al `app.onError()`.

---

## J

**JWT (JSON Web Token)**
Estándar (RFC 7519) para transmitir claims de forma compacta y autocontenida.
Estructura: `header.payload.signature` — cada parte es Base64URL.

---

## M

**Method chaining**
Patrón en Hono donde el router retorna `this` en cada definición de ruta,
permitiendo encadenar `.get(...).post(...).delete(...)`.
Requerido para que `AppType` infiera correctamente las rutas.

---

## P

**Payload (JWT)**
Segunda parte del JWT. Contiene los claims: `sub` (subject/user id), `exp` (expiración),
y cualquier dato personalizado como `username` o `role`.

---

## R

**Route group**
Sub-router creado con `new Hono()` y montado en la app principal con `app.route()`.
Permite organizar rutas por recurso o por dominio funcional.

---

## S

**Schema (Zod)**
Definición de la forma y reglas de un tipo de dato con `z.object({...})`.
Sirve como fuente única de verdad para validación en runtime y para inferir tipos TypeScript.

**Sign (JWT)**
`await sign(payload, secret)` — genera un JWT firmado con HMAC-SHA256.
Importado de `hono/jwt`. Usa la Web Crypto API (no requiere `nodejs_compat_v2`).

---

## V

**Validation middleware**
Middleware que valida los datos de entrada antes de que lleguen al handler.
En Hono: `zValidator("json", schema)` — si falla, el handler nunca se ejecuta.

**Verify (JWT)**
`await verify(token, secret)` — verifica la firma y la expiración (`exp`) del JWT.
Si el token es inválido o expiró, lanza un error. Importado de `hono/jwt`.

---

## Z

**zValidator**
Middleware de `@hono/zod-validator` que integra Zod con Hono.
`zValidator("json" | "param" | "query", schema)` — valida el input y almacena el resultado
tipado en `c.req.valid(target)`.
