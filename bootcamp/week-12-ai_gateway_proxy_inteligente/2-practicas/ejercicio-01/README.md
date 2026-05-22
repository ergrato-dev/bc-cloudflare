# Ejercicio 01 — Workers AI a través de AI Gateway

## Objetivo

Implementar un chatbot que enruta sus llamadas de inferencia a través de AI
Gateway. Verificarás que la caché funciona comprobando el header
`cf-aig-cache-status` en respuestas repetidas.

---

## Paso 1: Crear el gateway en el dashboard

Antes de ejecutar el Worker:

1. Dashboard Cloudflare → **AI** → **AI Gateway** → **Create Gateway**
2. Nombre: `bc-gateway` (o el nombre que prefieras — guarda el slug)
3. Copia el **Gateway ID** (slug) — lo necesitas en el código

---

## Paso 2: Variables de entorno en wrangler.jsonc

El `GATEWAY_ID` no es un secreto: se puede guardar como variable de entorno:

```jsonc
{
  "vars": {
    "GATEWAY_ID": "bc-gateway"
  }
}
```

**Abre `starter/wrangler.jsonc`** y reemplaza `"bc-gateway"` con tu slug.

---

## Paso 3: Tipo Bindings con AI y GATEWAY_ID

```typescript
type Bindings = {
  AI: Ai;
  GATEWAY_ID: string; // variable de entorno con el slug del gateway
};
```

**Abre `starter/src/index.ts`** y completa el TODO del tipo `Bindings`.

---

## Paso 4: POST /chat — llamada con gateway y caché

Pasa el gateway ID como tercer argumento de `AI.run()`:

```typescript
const result = await c.env.AI.run(
  "@cf/meta/llama-3.1-8b-instruct",
  { messages, max_tokens: 512 },
  {
    gateway: {
      id: c.env.GATEWAY_ID,
      skipCache: false,
      cacheTtl: 3600,
    },
  }
);
```

**Completa el TODO del POST /chat en el starter.**

---

## Paso 5: POST /chat/fresh — forzar bypass de caché

Usa `skipCache: true` para ignorar la caché y forzar una nueva llamada:

```typescript
{ gateway: { id: c.env.GATEWAY_ID, skipCache: true } }
```

**Completa el TODO del POST /chat/fresh en el starter.**

---

## Verificación

```bash
cd starter && pnpm install && wrangler dev

# Primera llamada — MISS (llama al modelo)
curl -si -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué es Cloudflare Workers?"}' | grep -E "cf-aig|reply"

# Segunda llamada idéntica — HIT (respuesta desde caché)
curl -si -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué es Cloudflare Workers?"}' | grep -E "cf-aig|reply"

# Fuerza bypass de caché
curl -si -X POST http://localhost:8787/chat/fresh \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué es Cloudflare Workers?"}' | grep "cf-aig"
```

Observa cómo la segunda llamada devuelve `cf-aig-cache-status: HIT` y
responde mucho más rápido que la primera.

> **Nota**: En `wrangler dev` la caché del gateway puede comportarse diferente
> que en producción. Para ver `HIT` en local, prueba con `wrangler dev --remote`.
