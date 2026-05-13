# Estructura de un Worker

> ![Handlers de un Worker](../0-assets/02-worker-handlers.svg)

## Objetivos

- Escribir y entender la estructura mínima de un Worker
- Conocer los tres handlers disponibles: fetch, scheduled, email
- Configurar `wrangler.jsonc` con los campos obligatorios

---

## 1. El módulo Worker

Un Worker es un módulo ES que exporta un objeto con handlers.
No hay `require`, no hay `process`, no hay `__dirname` — solo Web APIs.

```typescript
// src/index.ts
export interface Env {
  // Aquí se declaran los bindings del Worker (KV, D1, R2…)
  // Por ahora vacío — se ampliará en semanas posteriores
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response("Hola edge", { status: 200 });
  },
};
```

Los tres parámetros del handler `fetch`:

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `req` | `Request` | La request HTTP entrante (inmutable) |
| `env` | `Env` | Bindings declarados en `wrangler.jsonc` |
| `ctx` | `ExecutionContext` | Expone `waitUntil()` y `passThroughOnException()` |

---

## 2. Handler fetch — HTTP

Recibe toda request HTTP que llegue al Worker. Devuelve obligatoriamente
una `Response`. Si lanza sin catchear, Cloudflare devuelve 500.

```typescript
async fetch(req: Request, env: Env) {
  const url = new URL(req.url);

  // Enrutar por pathname
  if (url.pathname === "/health") {
    return new Response("ok", { status: 200 });
  }

  if (url.pathname === "/version") {
    return Response.json({ version: "1.0.0", env: "production" });
  }

  return new Response("Not found", { status: 404 });
},
```

`Response.json()` es un shorthand que setea `Content-Type: application/json`
automáticamente. Equivale a `new Response(JSON.stringify(data), { headers: {...} })`.

---

## 3. ctx.waitUntil — tareas post-respuesta

`ctx.waitUntil(promise)` permite lanzar trabajo en background **después**
de haber devuelto la Response al cliente. El Isolate no se destruye hasta
que la Promise se resuelva.

```typescript
async fetch(req: Request, env: Env, ctx: ExecutionContext) {
  // Responder de inmediato — el cliente no espera el log
  const response = Response.json({ ok: true });

  // Registrar el acceso en background (sin bloquear al cliente)
  ctx.waitUntil(
    fetch("https://analytics.internal/log", {
      method: "POST",
      body: JSON.stringify({ path: new URL(req.url).pathname, ts: Date.now() }),
    })
  );

  return response;
},
```

> Nunca uses `await` directo para tareas no críticas que no afectan
> la Response. `waitUntil` es la herramienta correcta.

---

## 4. Handler scheduled — Cron

Se dispara por un trigger de cron definido en `wrangler.jsonc`.
No recibe request ni devuelve Response.

```typescript
async scheduled(ctrl: ScheduledController, env: Env, ctx: ExecutionContext) {
  // ctrl.scheduledTime: timestamp del disparo en milisegundos
  // ctrl.cron: expresión cron que lo activó ("*/5 * * * *")
  console.log(`Cron '${ctrl.cron}' ejecutado a ${new Date(ctrl.scheduledTime).toISOString()}`);

  // Tareas típicas: limpiar registros expirados, sincronizar datos, alertas
},
```

Configurar el trigger en `wrangler.jsonc`:

```jsonc
{
  "triggers": {
    "crons": ["*/5 * * * *"]
  }
}
```

---

## 5. Handler email — Email Worker

Recibe emails entrantes a una dirección asociada al Worker.

```typescript
async email(msg: EmailMessage, env: Env) {
  const subject = msg.headers.get("subject") ?? "(sin asunto)";
  const from = msg.from;

  // Opción A: reenviar a otra dirección
  await msg.forward("admin@example.com");

  // Opción B: rechazar el email con motivo
  // msg.setReject("Dirección no válida");
},
```

---

## 6. wrangler.jsonc — configuración completa

```jsonc
{
  // Nombre del Worker (aparece en el dashboard y en la URL .workers.dev)
  "name": "mi-primer-worker",

  // Entry point TypeScript
  "main": "src/index.ts",

  // Controla qué cambios de runtime están activos (fecha pasada real)
  "compatibility_date": "2024-09-23",

  // Activa polyfills modernos de Node.js (buffer, events, stream, crypto…)
  "compatibility_flags": ["nodejs_compat_v2"],

  // Variables de entorno en texto plano (no secretos)
  "vars": {
    "APP_ENV": "development"
  }
}
```

`compatibility_date` controla qué cambios de runtime están activos.
Usar siempre una fecha pasada real — nunca `"latest"`.
Los secretos van con `wrangler secret put`, no en `wrangler.jsonc`.

---

## ✅ Checklist

- [ ] ¿Sé qué devuelve obligatoriamente el handler `fetch`?
- [ ] ¿Puedo crear un Worker que responda diferente según el path de la URL?
- [ ] ¿Entiendo para qué sirve `ctx.waitUntil()` y cuándo usarlo?
- [ ] ¿Sé qué hace `compatibility_date` en `wrangler.jsonc`?

---

## Referencias

- [Workers Runtime API](https://developers.cloudflare.com/workers/runtime-apis/)
- [Scheduled Workers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [ExecutionContext](https://developers.cloudflare.com/workers/runtime-apis/context/)
