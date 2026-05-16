# Ejercicio 01 — Contador Persistente con Durable Objects

## Objetivo

Implementar un `CounterDO` con Storage API que mantiene contadores nombrados
independientes — cada nombre tiene su propia instancia DO con estado aislado.

---

## Paso 1: Binding en wrangler.jsonc

Los Durable Objects requieren dos declaraciones: el **binding** (cómo el Worker
accede al namespace) y la **migration** (Cloudflare aprovisiona el storage).

```jsonc
{
  "durable_objects": {
    "bindings": [
      { "name": "COUNTER_DO", "class_name": "CounterDO" }
    ]
  },
  "migrations": [
    { "tag": "v1", "new_classes": ["CounterDO"] }
  ]
}
```

**Abre `starter/src/index.ts`** y revisa la definición del tipo `Env`.

---

## Paso 2: Clase CounterDO — leer y escribir

El método `fetch()` del DO recibe la petición HTTP redirigida desde el Worker.
Usa `this.storage` para leer y escribir el valor del contador.

```typescript
async fetch(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === "/increment") {
    const current = (await this.storage.get<number>("count")) ?? 0;
    await this.storage.put("count", current + 1);
    return Response.json({ count: current + 1 });
  }

  const count = (await this.storage.get<number>("count")) ?? 0;
  return Response.json({ count });
}
```

**Abre `starter/src/index.ts`** y completa los TODOs del DO `CounterDO`.

---

## Paso 3: Rutas HTTP en el Worker Router

El Worker recibe el nombre del contador, obtiene el stub con `idFromName()` y
delega la petición al DO con `stub.fetch()`.

```typescript
app.get("/counter/:name", async (c) => {
  const id = c.env.COUNTER_DO.idFromName(c.req.param("name"));
  const stub = c.env.COUNTER_DO.get(id);
  const res = await stub.fetch("https://do/");
  return c.json(await res.json());
});
```

**Abre `starter/src/index.ts`** y completa los TODOs de las rutas del Worker.

---

## Paso 4: Reset con transaction()

La ruta DELETE `/counter/:name/reset` debe poner el contador a `0` usando
`transaction()` para garantizar atomicidad.

```typescript
await this.storage.transaction(async (txn) => {
  await txn.put("count", 0);
  await txn.put("resetAt", new Date().toISOString());
});
return Response.json({ reset: true });
```

**Abre `starter/src/index.ts`** y completa el TODO del reset.

---

## Paso 5: Probar con Wrangler

```bash
pnpm wrangler dev

# Leer contador (empieza en 0)
curl http://localhost:8787/counter/ventas

# Incrementar
curl -X POST http://localhost:8787/counter/ventas/increment

# Incrementar varias veces
for i in 1 2 3; do curl -X POST http://localhost:8787/counter/ventas/increment; done

# Resetear
curl -X DELETE http://localhost:8787/counter/ventas/reset
```

---

## Criterios de éxito

- [ ] `GET /counter/:name` devuelve `{ count: N }` con el valor actual
- [ ] `POST /counter/:name/increment` incrementa en 1 y devuelve el nuevo valor
- [ ] `DELETE /counter/:name/reset` pone el contador a 0
- [ ] Dos contadores con nombres distintos mantienen sus valores independientes
