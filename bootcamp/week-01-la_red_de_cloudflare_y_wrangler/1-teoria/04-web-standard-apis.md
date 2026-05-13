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
- ❌ No disponible: `fs`, `path`, `http`, `net`, `child_process`

> Con `nodejs_compat_v2` se activan polyfills de Node.js para
> módulos comunes como `buffer`, `events`, `stream`, `crypto`.

---

## 2. URL, Request, Response y Headers

```typescript
// Parsear la URL de la request entrante
async fetch(req: Request) {
  const url = new URL(req.url);
  const page = url.searchParams.get("page") ?? "1";
  const token = req.headers.get("Authorization") ?? "";

  // Construir respuesta con headers customizados
  return new Response(JSON.stringify({ page }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Powered-By": "Cloudflare Workers",
    },
  });
},
```

---

## 3. SubtleCrypto — operaciones criptográficas

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
```

---

## 4. ReadableStream — respuestas en streaming

```typescript
// Streaming de texto (útil para SSE o respuestas largas)
async fetch(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Escribir en background sin bloquear la Response
  (async () => {
    for (let i = 0; i < 5; i++) {
      await writer.write(encoder.encode(`chunk ${i}\n`));
    }
    await writer.close();
  })();

  return new Response(readable, {
    headers: { "Content-Type": "text/plain" },
  });
},
```

---

## ✅ Checklist

- [ ] ¿Puedo extraer query params de una URL con `new URL(req.url)`?
- [ ] ¿Sé qué módulos de Node.js activa `nodejs_compat_v2`?
- [ ] ¿Puedo generar un UUID o hacer un hash SHA-256 con `crypto.subtle`?
- [ ] ¿Entiendo la diferencia entre responder con `new Response(body)` y un `ReadableStream`?

## Referencias

- [Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/web-standards/)
- [nodejs_compat_v2](https://developers.cloudflare.com/workers/configuration/compatibility-dates/#nodejs-compatibility-flag)
