# Glosario — Semana 02: V8 Isolates y el Runtime de Workers

Términos clave de la semana ordenados alfabéticamente.

---

## B

**Bundle size**
Tamaño del Worker compilado (JavaScript + dependencias). Límite: 1 MB comprimido con gzip.
Superar el límite impide el deploy. Usa `wrangler deploy --dry-run` para verificar antes de subir.

---

## C

**Cold start**
Primera ejecución de un Isolate que aún no existe en un PoP. Requiere crear el contexto V8,
evaluar el módulo y ejecutar el top-level scope. Duración: 5–50 ms. Mucho menor que el cold
start de contenedores (~500 ms) o VMs (~segundos).

**CPU time**
Tiempo en que el hilo de V8 está activamente ejecutando código JavaScript/WASM.
No incluye tiempo de espera en I/O (fetch, KV, D1). Límite: 10 ms (Free) / 30 s (Paid).
Ver con `wrangler tail` → campo `cpu: Xms`.

---

## E

**ExecutionContext**
Objeto disponible en el handler de un Worker (`ctx` en la firma estándar).
Expone `ctx.waitUntil(promise)` para ejecutar tareas después de enviar la respuesta,
y `ctx.passThroughOnException()` para no interceptar errores en Workers de fetch.

---

## H

**HTTPException**
Clase de Hono para lanzar errores HTTP con status semántico. Al ser capturada por
`app.onError`, genera una respuesta JSON con el status correcto (400, 401, 404, 422, 500…).
Importar desde `"hono/http-exception"`.

---

## I

**Isolate**
Instancia ligera del engine V8 con su propio heap de memoria. Proporciona aislamiento
de código y datos entre Workers distintos sin necesidad de procesos separados.
Un Isolate puede ser reutilizado (warm) o nuevo (cold) para cada request.

---

## M

**Middleware**
Función que se ejecuta antes (o después) del handler de ruta. En Hono se registra
con `app.use("*", async (c, next) => { ... await next() ... })`. Útil para logging,
autenticación, validación de headers y timing.

---

## N

**nodejs_compat_v2**
Flag de compatibilidad de Cloudflare Workers que habilita el polyfill de módulos Node.js
(crypto, buffer, stream, path, url, events, etc.) dentro del runtime V8.
Se activa en `wrangler.jsonc` bajo `"compatibility_flags": ["nodejs_compat_v2"]`.

---

## O

**onError**
Método de la instancia `Hono` para registrar un handler global de errores.
Se ejecuta cuando una ruta lanza una excepción no capturada. Se debe declarar
antes de las rutas para garantizar que los errores de todas las rutas sean interceptados.

---

## P

**Polyfill**
Implementación de una API que no existe en el entorno nativo pero que se provee
como capa de compatibilidad. Los módulos Node.js en Workers son polyfills sobre las
Web APIs nativas del runtime V8.

---

## R

**Retire**
Fase final del lifecycle de un Isolate. Ocurre cuando el runtime decide eliminar
un Isolate caliente de memoria (por inactividad, presión de memoria o rotación de versiones).
El próximo request en ese PoP generará un nuevo cold start.

---

## S

**Subrequest**
Cualquier petición HTTP saliente que un Worker realice durante su ejecución
(fetch a APIs externas, Service Bindings, etc.). Límites: 50 (Free) / 1,000 (Paid) por invocación.
Usar `Promise.all` para subrequests paralelos reduce el CPU time total.

---

## T

**Top-level scope**
Código que se ejecuta una sola vez durante el cold start (fuera de cualquier handler).
Ideal para instanciar clientes, parsear configuración o declarar constantes costosas.
No compartir estado mutable entre requests desde el top-level scope.

---

## V

**V8**
Engine de JavaScript de código abierto desarrollado por Google, utilizado por Node.js,
Deno y Cloudflare Workers. En Workers, cada Worker se ejecuta en un Isolate de V8,
no en un proceso separado.

---

## W

**Wall-clock time**
Tiempo total transcurrido desde que el Worker recibe el request hasta que envía la respuesta,
incluyendo tiempo de espera en I/O (fetch, KV, D1). Límite: 30 segundos.
Distinto del CPU time: un Worker puede tener 1 ms de CPU time pero 200 ms de wall-clock time
si la mayor parte es espera en una llamada a una base de datos externa.

**Warm Isolate**
Isolate que ya existe en memoria en un PoP específico. Puede reutilizarse para un nuevo request
sin cold start. El runtime reutiliza el contexto V8 ya inicializado, logrando latencias de ~0.01 ms.
