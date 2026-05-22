# Ejercicio 02 — Proveedor Externo y Fallback con Endpoint Universal

## Objetivo

Implementar un Worker que llama a OpenAI a través de la URL del gateway y,
usando el endpoint universal, configura fallback automático a Workers AI si
OpenAI no está disponible o si la clave API no está configurada.

---

## Paso 1: Secreto OPENAI_API_KEY

La clave de OpenAI es un secreto — nunca va en `wrangler.jsonc`:

```bash
wrangler secret put OPENAI_API_KEY
# Escribe tu clave cuando se te solicite
```

Si no tienes cuenta de OpenAI, el ejercicio funciona igual: el fallback
a Workers AI se activará automáticamente.

---

## Paso 2: Variables de entorno

El `ACCOUNT_ID` y `GATEWAY_ID` se declaran como variables (no secretos):

```jsonc
{
  "vars": {
    "CF_ACCOUNT_ID": "tu-account-id-aqui",
    "GATEWAY_ID": "bc-gateway"
  }
}
```

**Abre `starter/wrangler.jsonc`** y ajusta los valores con tu account ID.

---

## Paso 3: POST /chat/openai — proveedor externo vía URL

Construye la URL del gateway y llama a OpenAI con `fetch`:

```typescript
const gatewayBase = `https://gateway.ai.cloudflare.com/v1/${c.env.CF_ACCOUNT_ID}/${c.env.GATEWAY_ID}`;

const response = await fetch(`${gatewayBase}/openai/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${c.env.OPENAI_API_KEY}`,
    "cf-aig-cache-ttl": "1800",
  },
  body: JSON.stringify({ model: "gpt-4o-mini", messages, max_tokens: 512 }),
});
```

**Completa el TODO del POST /chat/openai en el starter.**

---

## Paso 4: POST /chat/fallback — endpoint universal

Con el endpoint universal, defines el array de proveedores en orden:

```typescript
const providers = [
  {
    provider: "openai",
    endpoint: "chat/completions",
    headers: { "Authorization": `Bearer ${c.env.OPENAI_API_KEY}` },
    query: { model: "gpt-4o-mini", messages, max_tokens: 512 },
  },
  {
    provider: "workers-ai",
    endpoint: "@cf/meta/llama-3.1-8b-instruct",
    headers: { "Authorization": `Bearer ${c.env.CF_API_TOKEN}` },
    query: { messages, max_tokens: 512 },
  },
];

const response = await fetch(gatewayBase, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(providers),
});
```

**Completa el TODO del POST /chat/fallback en el starter.**

---

## Verificación

```bash
cd starter && pnpm install && wrangler dev

# Llama a OpenAI a través del gateway
curl -X POST http://localhost:8787/chat/openai \
  -H "Content-Type: application/json" \
  -d '{"message":"Explica qué es un proxy reverso en una oración"}'

# Fallback: intenta OpenAI, si falla usa Workers AI
curl -X POST http://localhost:8787/chat/fallback \
  -H "Content-Type: application/json" \
  -d '{"message":"¿Qué diferencia hay entre KV y D1 en Cloudflare?"}'
```

Verifica en el dashboard de AI Gateway que ambas llamadas aparecen en los
logs, con el proveedor real que respondió en la columna **Provider**.
