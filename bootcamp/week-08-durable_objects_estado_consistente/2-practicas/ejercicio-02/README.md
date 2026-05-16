# Ejercicio 02 — Rate Limiter con Alarms

## Objetivo

Implementar un `RateLimiterDO` que limita peticiones por ventana temporal.
Usa la Storage API para contar hits y los Alarms para resetear la ventana
automáticamente sin polling externo.

---

## Paso 1: Lógica del Rate Limiter

El DO mantiene un contador de hits en la ventana actual y la hora de reset.
Al recibir la primera petición de una ventana nueva, programa la alarma.

```typescript
// Si no hay alarma activa, programa el reset en 60 segundos
const alarm = await this.state.storage.getAlarm();
if (alarm === null) {
  const resetAt = Date.now() + 60_000;
  await this.state.storage.setAlarm(resetAt);
  await this.state.storage.put("resetAt", resetAt);
}
```

**Abre `starter/src/index.ts`** y completa el TODO del binding en el tipo `Env`.

---

## Paso 2: Contar y verificar el límite

```typescript
const LIMIT = 10; // máximo 10 requests por ventana de 60s

const hits = ((await this.storage.get<number>("hits")) ?? 0) + 1;
await this.storage.put("hits", hits);

const allowed = hits <= LIMIT;
const resetAt = (await this.storage.get<number>("resetAt")) ?? 0;
return Response.json({ allowed, hits, remaining: Math.max(0, LIMIT - hits), resetAt });
```

**Abre `starter/src/index.ts`** y completa el TODO del método `check()` del DO.

---

## Paso 3: Handler alarm() — resetear la ventana

```typescript
async alarm(): Promise<void> {
  await this.storage.put("hits", 0);
  await this.storage.delete("resetAt");
  console.log("[ratelimit] Ventana reseteada");
}
```

**Abre `starter/src/index.ts`** y completa el TODO del handler `alarm()`.

---

## Paso 4: Rutas del Worker

```typescript
// POST /ratelimit/:clientId/check — verifica si el cliente puede hacer el request
app.post("/ratelimit/:clientId/check", async (c) => {
  const id = c.env.RATE_LIMITER_DO.idFromName(c.req.param("clientId"));
  const stub = c.env.RATE_LIMITER_DO.get(id);
  const res = await stub.fetch("https://do/check", { method: "POST" });
  const data = await res.json<{ allowed: boolean }>();
  return c.json(data, data.allowed ? 200 : 429);
});
```

**Abre `starter/src/index.ts`** y completa los TODOs de ambas rutas del Worker.

---

## Paso 5: Probar con Wrangler

```bash
pnpm wrangler dev

# Primera petición — debe pasar (hits: 1)
curl -X POST http://localhost:8787/ratelimit/cliente-001/check

# Estado actual
curl http://localhost:8787/ratelimit/cliente-001/status

# Simula 10 peticiones rápidas — la última debe devolver 429
for i in $(seq 1 11); do
  echo -n "Hit $i: "
  curl -s -X POST http://localhost:8787/ratelimit/cliente-001/check | jq .allowed
done
```

---

## Criterios de éxito

- [ ] `POST /ratelimit/:clientId/check` devuelve 200 con `allowed: true` si hay cupo
- [ ] Devuelve 429 con `allowed: false` al superar el límite
- [ ] `GET /ratelimit/:clientId/status` muestra `hits`, `remaining` y `resetAt`
- [ ] La alarma resetea el contador al expirar la ventana
