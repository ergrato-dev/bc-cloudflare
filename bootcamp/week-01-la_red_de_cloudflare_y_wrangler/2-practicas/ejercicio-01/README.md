# Ejercicio 01 — Routing con URL en un Worker

Aprenderás a inspeccionar la URL entrante y devolver respuestas
distintas según el path, sin ningún framework externo.

---

## Paso 1: Parsear la URL

El constructor `new URL(req.url)` convierte el string de la URL en un
objeto con propiedades como `pathname`, `searchParams` y `hostname`.

```typescript
async fetch(req: Request) {
  const url = new URL(req.url);
  console.log(url.pathname); // "/", "/items", "/health"…
}
```

**Abre `starter/src/index.ts`** y completa el TODO 1.

---

## Paso 2: Enrutar por pathname

Usa `url.pathname` en un `switch` o con `if/else` para devolver
respuestas distintas por ruta.

```typescript
switch (url.pathname) {
  case "/":
    return new Response("Bienvenido al Worker");
  case "/health":
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });
  default:
    return new Response("Not Found", { status: 404 });
}
```

**Completa el TODO 2** con las tres rutas indicadas.

---

## Paso 3: Leer query parameters

`url.searchParams.get("nombre")` devuelve el valor del parámetro
o `null` si no existe.

```typescript
// GET /greet?name=Ana  →  "Hola, Ana"
const name = url.searchParams.get("name") ?? "visitante";
return new Response(`Hola, ${name}`);
```

**Completa el TODO 3** para la ruta `/greet`.

---

## Paso 4: Responder JSON con tipo correcto

JSON siempre necesita el header `Content-Type: application/json`.

```typescript
// Patrón correcto para respuestas JSON
return Response.json({ ok: true, items: [] });
// Response.json() añade el Content-Type automáticamente
```

**Completa el TODO 4** en la ruta `/info`.

---

## Verificar

```bash
cd starter && pnpm install && pnpm dev
```

Prueba cada ruta:
- `http://localhost:8787/`
- `http://localhost:8787/health`
- `http://localhost:8787/greet?name=TuNombre`
- `http://localhost:8787/info`
- `http://localhost:8787/ruta-inexistente` → 404
