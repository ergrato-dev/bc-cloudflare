# Ejercicio 02 — nodejs_compat_v2: Módulos Node.js en Workers

Aprenderás a usar módulos Node.js (`crypto`, `buffer`) dentro de un Worker
gracias al flag `nodejs_compat_v2`, y a combinarlos con Hono para construir
endpoints de utilidad criptográfica.

---

## Contexto

Construirás una API de **utilidades criptográficas** para una plataforma
de pagos ficticia. Necesitas:

- Generar tokens seguros para sesiones
- Firmar webhooks con HMAC-SHA256
- Verificar integridad de payloads

Todo esto requiere el módulo `crypto` de Node.js.

---

### Paso 1: Activar nodejs_compat_v2

El flag ya está en `wrangler.jsonc`. Verifica que puedes importar `crypto`:

```typescript
import { createHmac, randomBytes } from "crypto";
```

Si Wrangler lanza un error de módulo, verifica que el flag está en
`"compatibility_flags": ["nodejs_compat_v2"]`.

**Abre `starter/src/index.ts`** y revisa los imports del Paso 1.

---

### Paso 2: Endpoint de generación de tokens

Genera un token aleatorio seguro de N bytes usando `randomBytes`:

```typescript
// randomBytes(32) → 32 bytes aleatorios → 64 chars hex
const token = randomBytes(32).toString("hex");
```

**Completa el TODO del Paso 2** — implementa `GET /token` y `GET /token/:bytes`.

---

### Paso 3: Endpoint de hash SHA-256

Hashea un texto con `createHash`:

```typescript
import { createHash } from "crypto";

const hash = createHash("sha256").update(input).digest("hex");
```

**Completa el TODO del Paso 3** — implementa `POST /hash` que acepta
`{ text: string }` y devuelve `{ hash: string, algorithm: "sha256" }`.

---

### Paso 4: Endpoint de firma HMAC

Firma un payload con HMAC-SHA256 usando una clave secreta del env:

```typescript
import { createHmac } from "crypto";

const signature = createHmac("sha256", secret)
  .update(payload)
  .digest("hex");
```

**Completa el TODO del Paso 4** — implementa `POST /sign` que acepta
`{ payload: string }` y devuelve `{ signature: string }`.

---

### Paso 5: Endpoint de verificación HMAC

Verifica que un signature es válido para un payload dado.
Usa comparación segura para evitar timing attacks:

```typescript
import { timingSafeEqual } from "crypto";

const expected = Buffer.from(expectedSig, "hex");
const received = Buffer.from(receivedSig, "hex");
const isValid = timingSafeEqual(expected, received);
```

**Completa el TODO del Paso 5** — implementa `POST /verify`.

---

### Probar el Worker

```bash
cd starter
pnpm install
wrangler dev
```

```bash
# Generar token de 32 bytes (default)
curl http://localhost:8787/token

# Generar token de 16 bytes
curl http://localhost:8787/token/16

# Hash de un texto
curl -X POST http://localhost:8787/hash \
  -H "Content-Type: application/json" \
  -d '{"text": "hola mundo"}'

# Firmar un payload
curl -X POST http://localhost:8787/sign \
  -H "Content-Type: application/json" \
  -d '{"payload": "user_id=42&action=purchase"}'
```
