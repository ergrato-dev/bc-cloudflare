# Semana 01 — La Red de Cloudflare y Wrangler 3

> **Etapa 0 — Fundamentos del Edge** · Bootcamp Cloudflare De Cero a Héroe

---

## 🎯 Objetivos

- Entender cómo funciona la red Anycast de Cloudflare y por qué elimina el cold start
- Configurar Wrangler 3, autenticarse y desplegar tu primer Worker en producción
- Escribir un Worker con handlers `fetch`, `scheduled` y comprender `env` y `ctx`
- Construir una API REST básica con Hono y enrutamiento por pathname

---

## ⏱️ Distribución del tiempo (8h)

| Bloque | Actividad | Horas |
|--------|-----------|-------|
| Teoría | La red, Workers, Wrangler 3, Web APIs | 2.0h |
| Práctica | Ej-01: routing con URL · Ej-02: Hono | 3.0h |
| Proyecto | API inicial para tu dominio asignado | 2.5h |
| Recursos | Documentación oficial y videografía | 0.5h |

---

## 🗂️ Contenido

### Teoría

| Archivo | Tema |
|---------|------|
| [01-la-red-de-cloudflare.md](1-teoria/01-la-red-de-cloudflare.md) | Anycast, PoPs, edge-first vs serverless |
| [02-primer-worker.md](1-teoria/02-primer-worker.md) | Estructura del módulo, handlers fetch/scheduled/email |
| [03-wrangler-cli.md](1-teoria/03-wrangler-cli.md) | dev · deploy · tail · secrets |
| [04-web-standard-apis.md](1-teoria/04-web-standard-apis.md) | URL, Request, Response, Crypto, Streams |

### Prácticas

| Ejercicio | Concepto |
|-----------|----------|
| [Ej-01: Routing con URL](2-practicas/ejercicio-01/) | Enrutar requests sin framework |
| [Ej-02: Hono](2-practicas/ejercicio-02/) | Framework HTTP, middleware y 404 |

### Proyecto

[API inicial para tu dominio →](3-proyecto/)

### Recursos y glosario

- [📚 Recursos](4-recursos/) — videografía y webgrafía
- [📝 Glosario](5-glosario/) — 10 términos clave de la semana
- [📊 Rúbrica](rubrica-evaluacion.md)

---

## ✅ Checklist de Entrega

- [ ] Ejercicios completados con Worker deployado
- [ ] Proyecto adaptado al dominio asignado y deployado
- [ ] URL de producción Cloudflare entregada
- [ ] Evidencias del cuestionario completadas
