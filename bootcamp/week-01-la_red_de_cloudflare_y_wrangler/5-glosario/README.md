# Glosario — Semana 01

> La Red de Cloudflare y Wrangler 3

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## Anycast

Técnica de enrutamiento de red en la que la misma dirección IP se anuncia
desde múltiples ubicaciones geográficas vía BGP. El router del ISP envía
el paquete al nodo más cercano topológicamente.
En Cloudflare: todos los Workers comparten una IP Anycast — el usuario
siempre llega al PoP más cercano sin configuración manual.

---

## Binding

Conexión declarada en `wrangler.jsonc` que permite a un Worker acceder
a un recurso de Cloudflare (KV, D1, R2, Queue…). El binding expone el
recurso como una propiedad del objeto `env` en el handler.

---

## compatibility_date

Fecha en `wrangler.jsonc` que determina qué versión del runtime de Workers
se usa. Los cambios de comportamiento del runtime se agrupan por fecha para
no romper Workers existentes. Siempre debe ser una fecha pasada real.

---

## Execution Context (ctx)

Objeto pasado al handler `fetch` que expone `ctx.waitUntil(promise)`.
Permite lanzar tareas asíncronas que continúan ejecutándose después de
que el Worker devuelva la Response, sin bloquear al cliente.

---

## Isolate (V8 Isolate)

Instancia aislada del engine V8 de JavaScript. Cada Worker corre en su
propio Isolate — sin estado compartido entre requests ni Workers.
El arranque es en microsegundos (no hay cold start perceptible como en Lambda).

---

## Miniflare

Simulador local del runtime de Cloudflare Workers usado por `wrangler dev`.
Implementa KV, D1, R2, Queues y otros bindings localmente, sin necesidad
de conexión a internet ni consumo de cuota del plan.

---

## nodejs_compat_v2

Flag de compatibilidad que activa polyfills modernos de módulos Node.js
(`buffer`, `events`, `stream`, `crypto`, `path`…) en el runtime de Workers.
Reemplaza al flag `nodejs_compat` original con mayor cobertura.

---

## PoP (Point of Presence)

Datacenter propio de Cloudflare en una ciudad. Cloudflare opera 300+ PoPs
en 100+ países. Es donde se ejecuta físicamente el código de los Workers
cuando llega una request del usuario más cercano.

---

## wrangler.jsonc

Archivo de configuración del proyecto Workers. Define el nombre del Worker,
el entry point, la `compatibility_date`, los bindings (KV, D1, R2…),
las variables de entorno y los cron triggers.

---

## Worker

Función JavaScript/TypeScript que corre en el runtime de Cloudflare (V8)
en el PoP más cercano al usuario. Exporta un objeto con handlers:
`fetch` (HTTP), `scheduled` (cron) y `email` (email entrante).
