# Web Standard APIs en Workers

## Objetivos

- Conocer qué APIs del browser están disponibles en el runtime de Workers
- Usar `URL`, `Request`, `Response` y `Headers` correctamente
- Entender cuándo usar `SubtleCrypto` y `ReadableStream`

---

## 1. El runtime de Workers no es Node.js

Workers corre V8, no Node.js. Esto significa:

- ✅ Disponible: `fetch`, `URL`, `Request`, `Response`, `Headers`
- ✅ Disponible: `crypto.subtle`, `TextEncoder`, `ReadableStream`
- ✅ Disponible: `setTimeout`, `setInterval` (limitado a wall clock)
- ✅ Disponible: `WebSocket`, `Cache`, `navigator.sendBeacon`
- ❌ No disponible: `fs`, `path`, `http`, `net`, `child_process`
- ❌ No disponible: `process.env`, `__dirname`, `require`

> Con `nodejs_compat_v2` se activan polyfills de Node.js para
> módulos comunes: `buffer`, `events`, `stream`, `crypto`, `querystring`,
> `string_decoder`, `util`, `assert`, `path`.

Si intentas usar `import fs from "fs"` sin el flag activado, el Worker
falla en tiempo de deploy con un error de módulo no encontrado.

---

## 2. URL, Request, Response y Headers

La API de `URL` es la forma estándar de parsear rutas y query params:

```typescript
async fetch(req: Request) {
  const url = new URL(req.url);

  // Pathname: "/items/42"
  const pathname = url.pathname;

  // Query params: "?page=2&limit=10"
  const page = Number(url.searchParams.get("page") ?? "1");
  const limit = Number(url.searchParams.get("limit") ?? "10");

  // Headers de la request
  const token = req.headers.get("Authorization") ?? "";
  const contentType = req.headers.get("Content-Type") ?? "";

  // Construir respuesta con headers customizados
  return new Response(JSON.stringify({ page, limit }), {
    status: 200,
    headers: new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Powered-By": "Cloudflare Workers",
    }),
  });
},
```

`Response.json()` como shorthand (disponible desde `compatibility_date >= 2022-01-31`):

```typescript
// Equivalente al bloque anterior, más conciso
return Response.json({ page, limit }, { status: 200 });
```

---

## 3. Subrequests — fetch() saliente

Un Worker puede hacer `fetch()` a servicios externos. Cloudflare llama
a estas llamadas **subrequests**. El límite es 1000 subrequests por invocación.

```typescript
async fetch(req: Request, env: Env) {
  // Llamar a una API externa desde el Worker
  const resp = await fetch("https://api.example.com/data", {
    method: "GET",
    headers: { Authorization: `Bearer ${env.API_KEY}` },
  });

  if (!resp.ok) {
    return new Response("Error en servicio externo", { status: 502 });
  }

  const data = await resp.json();
  return Response.json(data);
},
```

> Evitar `await fetch()` en serie cuando las llamadas son independientes.
> Usar `Promise.all()` para hacerlas en paralelo.

---

## 4. SubtleCrypto — operaciones criptográficas

```typescript
// Generar un UUID v4 seguro
const id = crypto.randomUUID();

// Hash SHA-256 de un string
async function hashText(text: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// HMAC-SHA256 para firmar payloads (webhooks, tokens)
async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}
```

HMAC-SHA256 es el estándar para verificar webhooks de GitHub, Stripe, etc.

---

## 5. ReadableStream — respuestas en streaming

Útil para SSE (Server-Sent Events), respuestas largas o AI streaming:

```typescript
async fetch(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Escribir en background sin bloquear la Response
  (async () => {
    const items = ["dato 1", "dato 2", "dato 3", "dato 4", "dato 5"];
    for (const item of items) {
      await writer.write(encoder.encode(`data: ${item}\n\n`));
    }
    await writer.close();
  })();

  // La Response empieza a llegar al cliente inmediatamente
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
},
```

El patrón `TransformStream` es el mismo que usa `@cloudflare/ai` para
streaming de LLMs en Workers AI (semana 10).

---

## 6. Cache API — caché a nivel de PoP

Cada PoP tiene una caché local accesible desde Workers:

```typescript
async fetch(req: Request) {
  const cache = caches.default;
  const cacheKey = new Request(req.url);

  // Intentar leer de caché primero
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  // Si no está en caché, computar y guardar
  const data = await fetch("https://api.example.com/slow-data");
  const response = new Response(await data.text(), {
    headers: { "Cache-Control": "public, max-age=60" },
  });

  // Guardar en caché del PoP actual (no bloquear al cliente)
  // ctx.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
},
```

> La Cache API es local al PoP — no es una caché compartida entre PoPs.
> Para caché global usar KV (semana 4) o el header `Cache-Control` estándar.

---

## ✅ Checklist

- [ ] ¿Puedo extraer query params de una URL con `new URL(req.url)`?
- [ ] ¿Sé qué módulos de Node.js activa `nodejs_compat_v2`?
- [ ] ¿Puedo generar un UUID o hacer un hash SHA-256 con `crypto.subtle`?
- [ ] ¿Entiendo la diferencia entre responder con `new Response(body)` y un `ReadableStream`?

---

## Referencias

- [Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/web-standards/)
- [nodejs_compat_v2](https://developers.cloudflare.com/workers/configuration/compatibility-dates/#nodejs-compatibility-flag)
- [Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/)
