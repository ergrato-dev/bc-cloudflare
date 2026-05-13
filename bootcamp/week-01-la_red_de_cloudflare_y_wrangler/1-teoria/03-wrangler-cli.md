# Wrangler 3 — CLI de Cloudflare Workers

> ![Flujo de desarrollo con Wrangler](../0-assets/03-wrangler-workflow.svg)

## Objetivos

- Instalar Wrangler y autenticarse con una cuenta Cloudflare
- Usar `wrangler dev` para el ciclo de desarrollo local
- Desplegar y observar un Worker en producción

---

## 1. Instalación y autenticación

```bash
# Instalar de forma global con versión exacta
pnpm add -g wrangler@4.90.1

# Autenticarse (abre el navegador para OAuth con la cuenta Cloudflare)
wrangler login

# Verificar autenticación y cuenta activa
wrangler whoami
```

La autenticación guarda un token OAuth en `~/.wrangler/config/default.toml`.
Para entornos CI/CD se usa la variable de entorno `CLOUDFLARE_API_TOKEN`.

> `.dev.vars` almacena variables de entorno locales para `wrangler dev`.
> Nunca hacer commit de este archivo — ya está en `.gitignore`.

Ejemplo de `.dev.vars`:

```
# .dev.vars — solo para desarrollo local, nunca en git
DATABASE_URL=postgresql://localhost:5432/mydb
API_SECRET=dev-secret-local
```

---

## 2. wrangler dev — desarrollo local

```bash
# Arranca Miniflare en http://localhost:8787 (sin internet)
wrangler dev

# Con hot-reload y acceso a recursos reales de Cloudflare
wrangler dev --remote

# Cambiar el puerto
wrangler dev --port 3000

# Inspeccionar con Chrome DevTools
wrangler dev --inspector-port 9229
```

`wrangler dev` (sin `--remote`) corre Miniflare localmente — no consume
cuota del plan, no necesita internet y recarga al guardar.

`wrangler dev --remote` conecta a los recursos reales (KV, D1 remoto…),
útil cuando necesitas datos reales o bindings que Miniflare no emula.

Miniflare emula localmente:

| Binding | Soporte local |
|---------|---------------|
| KV | ✅ SQLite local |
| D1 | ✅ SQLite local |
| R2 | ✅ Filesystem local |
| Queues | ✅ In-memory |
| Durable Objects | ✅ In-memory |

---

## 3. wrangler deploy — despliegue

```bash
# Despliega a producción en Workers.dev
wrangler deploy

# Despliega a un entorno específico (staging, prod definido en wrangler.jsonc)
wrangler deploy --env staging

# Ver qué se va a desplegar sin ejecutar el deploy
wrangler deploy --dry-run
```

El Worker queda activo en `https://<nombre>.<subdominio>.workers.dev`
en cuestión de segundos. Los 300+ PoPs reciben el código al instante vía
la red interna de Cloudflare — no hay routing por regiones.

Antes del primer deploy es necesario:

```bash
# Generar los tipos TypeScript de los bindings
wrangler types   # genera worker-configuration.d.ts
```

---

## 4. wrangler tail — logs en tiempo real

```bash
# Logs de producción en tiempo real
wrangler tail

# Filtrar por status code HTTP
wrangler tail --status error
wrangler tail --status 404

# Filtrar por método HTTP
wrangler tail --method POST

# Filtrar por ruta (URL que contenga /api)
wrangler tail --search /api
```

Cada request muestra: método, path, status code, duración en ms y
los `console.log()` emitidos por el Worker durante esa invocación.

Ejemplo de salida:

```
GET /items - 200 [4ms]
  console.log: "Devolviendo 10 items"
POST /items - 400 [1ms]
  console.log: "Validación fallida: name es requerido"
```

---

## 5. Gestión de secretos

```bash
# Guardar un secreto cifrado (solicita el valor de forma interactiva)
wrangler secret put API_KEY

# Ver qué secretos están configurados (sin mostrar valores)
wrangler secret list

# Eliminar un secreto
wrangler secret delete API_KEY
```

Los secretos se acceden en el Worker vía `env.API_KEY` igual que
cualquier variable de entorno — pero nunca aparecen en texto plano
en el dashboard ni en `wrangler tail`.

```typescript
// Usar el secreto en el Worker
async fetch(req: Request, env: Env) {
  // env.API_KEY está disponible desde wrangler secret put
  const isValid = req.headers.get("x-api-key") === env.API_KEY;
  if (!isValid) return new Response("Unauthorized", { status: 401 });
  return Response.json({ data: "ok" });
},
```

Declarar el secreto en la interfaz `Env`:

```typescript
export interface Env {
  API_KEY: string; // secreto gestionado con wrangler secret put
}
```

---

## 6. Comandos adicionales útiles

```bash
# Listar Workers deployados en la cuenta
wrangler deployments list

# Ver los últimos deploys de un Worker
wrangler deployments list --name mi-worker

# Rollback a un deploy anterior
wrangler rollback <deployment-id>

# Generar tipos TypeScript de los bindings
wrangler types
```

---

## ✅ Checklist

- [ ] ¿Puedo correr `wrangler dev` y ver mi Worker en localhost:8787?
- [ ] ¿Sé la diferencia entre `wrangler dev` y `wrangler dev --remote`?
- [ ] ¿Puedo guardar un secreto con `wrangler secret put` y leerlo en el Worker?
- [ ] ¿Sé filtrar logs de producción con `wrangler tail --status error`?

---

## Referencias

- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/commands/)
- [Get Started with Workers](https://developers.cloudflare.com/workers/get-started/guide/)
- [Miniflare](https://miniflare.dev/)
