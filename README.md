<p align="center">
  <img src="assets/bootcamp-header.svg" alt="Bootcamp Cloudflare — De Cero a Héroe" width="860">
</p>

# Bootcamp Cloudflare — De Cero a Héroe

<!-- Badges -->
![License CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
![21 Semanas](https://img.shields.io/badge/Duración-21%20Semanas-blue)
![168 Horas](https://img.shields.io/badge/Total-168%20Horas-orange)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020)

[English Version](README_EN.md)

---

## 📋 Descripción

Bootcamp intensivo de **21 semanas (~5 meses)** diseñado para llevar a estudiantes
desde cero hasta **Cloudflare Developer Junior**, con énfasis en Workers y los
cambios más recientes de la plataforma (2024–2026). El enfoque es 100% práctico:
cada semana combina teoría concisa, ejercicios guiados y un proyecto integrador
adaptado al dominio asignado.

> 🏛️ **Política de Dominios Únicos (Anticopia):** Cada aprendiz trabaja sobre
> un dominio de negocio único asignado por el instructor. Esto garantiza
> implementaciones originales y previene la copia entre compañeros.

### 🎯 Objetivos

Al finalizar el bootcamp, los estudiantes serán capaces de:

- ✅ Desplegar Workers a producción con Wrangler 3 y CI/CD (GitHub Actions)
- ✅ Diseñar APIs type-safe con Hono v4 y TypeScript en el edge
- ✅ Persistir datos con D1 (DrizzleORM), KV, R2, Durable Objects e Hyperdrive
- ✅ Procesar eventos asincrónicos con Queues y orquestar con Workflows
- ✅ Construir pipelines RAG usando Workers AI, Vectorize y AI Gateway
- ✅ Construir AI Agents con memoria persistente e integración MCP
- ✅ Implementar Service Bindings con RPC type-safe entre Workers
- ✅ Operar plataformas multi-tenant con Workers for Platforms
- ✅ Observar, testear y securizar Workers en producción

### 🚀 ¿Por qué Cloudflare Workers?

> Workers primero — el orden correcto para aprender el edge en 2026.

Este bootcamp enseña **Workers desde el inicio** como plataforma unificada:
computa, almacena, encola, orquesta e infiere en el mismo runtime. Cloudflare
Pages está en modo mantenimiento; Workers (con Assets) es el destino de todos
los proyectos nuevos.

La adquisición de **Astro** (enero 2026) y el patrocinio oficial a **TanStack**
hacen de este stack la apuesta long-term de Cloudflare para el desarrollo web.

---

## 🗓️ Estructura del Bootcamp

| Etapa | Semanas | Horas | Énfasis |
|-------|---------|-------|---------|
| Etapa 0 — Fundamentos del Edge | 1–4 | 32h | Red CF, Wrangler 3, runtime Workers, KV |
| Etapa 1 — Persistencia y Datos | 5–9 | 40h | D1, R2, Queues, Durable Objects, Hyperdrive |
| Etapa 2 — AI en el Edge | 10–14 | 40h | Workers AI, Vectorize, AI Gateway, RAG, Agents |
| Etapa 3 — Full-Stack Avanzado | 15–18 | 32h | Pages/Assets, Service Bindings RPC, Workers for Platforms, Workflows |
| Etapa 4 — Producción y Plataforma | 19–21 | 24h | Observabilidad, Seguridad, Proyecto Final |

**Total: 21 semanas · ~168 horas**

---

## 📚 Contenido por Semana

Cada semana incluye:

```
bootcamp/week-XX-tema_principal/
├── README.md                 # Descripción y objetivos
├── rubrica-evaluacion.md     # Criterios de evaluación
├── 0-assets/                 # Diagramas SVG (arquitectura, flujos)
├── 1-teoria/                 # Material teórico en markdown
├── 2-practicas/              # Ejercicios guiados
│   └── ejercicio-XX/
│       ├── README.md
│       ├── starter/          # Worker incompleto con TODOs guiados
│       └── solution/         # Worker completo resuelto
├── 3-proyecto/               # Proyecto semanal integrador
│   └── starter/              # wrangler.jsonc + src/ con TODOs
├── 4-recursos/               # Recursos adicionales
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/               # Términos Cloudflare clave (A–Z)
```

### 🔑 Componentes Clave

- 📖 **Teoría**: Conceptos fundamentales con ejemplos TypeScript ejecutables
- 💻 **Práctica**: Workers guiados (completa los TODOs, no adivines)
- 📝 **Evaluación**: Evidencias de conocimiento, desempeño y producto
- 🎓 **Recursos**: Documentación oficial, blog Cloudflare, referencias

---

### Etapa 0 — Fundamentos del Edge (Semanas 1–4)

#### Semana 01 — La Red de Cloudflare y Wrangler 3
- Arquitectura: Anycast, PoPs, modelo edge-first vs serverless tradicional
- Cuenta Cloudflare, Wrangler v3 — instalación, autenticación, comandos esenciales
- Primer Worker: handlers `fetch`, `scheduled`, `email`
- `wrangler dev` (local + remoto), `wrangler deploy`, `wrangler tail`
- Web Standard APIs disponibles en el runtime (URL, Crypto, Cache, Streams)

#### Semana 02 — V8 Isolates y el Runtime de Workers
- V8 Isolates vs contenedores vs Lambda — por qué importa el modelo de aislamiento
- `nodejs_compat` vs `nodejs_compat_v2` — qué cambia (2024)
- Límites del runtime: CPU time, memory, wall clock, subrequests, request size
- Workers Free vs Paid — cuándo y por qué migrar
- Smart Placement — optimización automática de ubicación geográfica

#### Semana 03 — HTTP Avanzado y Routing con Hono
- `Request` / `Response` / `Headers`, `ReadableStream`, `TransformStream`
- CORS seguro en Workers — patrones correctos
- Hono v4 como framework principal: routing, middleware, context, RPC client
- Comparativa: Hono vs itty-router vs vanilla Workers
- Patterns: autenticación JWT, logging, error handling middleware

#### Semana 04 — Workers KV y Cache API
- KV Store: consistencia eventual, casos de uso, límites de escritura
- Namespaces, bindings en `wrangler.jsonc`, tipos de valor
- TTL, metadata, `expirationTtl` vs `expiration`
- Cache API — caché programático de `Response` HTTP
- Patrones: cache-aside, stale-while-revalidate

---

### Etapa 1 — Persistencia y Datos (Semanas 5–9)

#### Semana 05 — D1: SQLite en el Edge
- D1 vs SQLite local vs PostgreSQL — qué es y qué no es
- Crear databases, schema, migraciones con `wrangler d1 migrations`
- Prepared statements, batch statements, transacciones
- D1 + DrizzleORM — schema-first, type-safe queries, migrations automáticas
- Seeding, backup/restore, `wrangler d1 execute`

#### Semana 06 — R2: Object Storage
- R2 vs S3: compatibilidad S3 API, cero egress fees — impacto en arquitectura
- Buckets, bindings, operaciones: `put` / `get` / `delete` / `list`
- Presigned URLs — upload directo desde el cliente
- Multipart upload para archivos grandes
- Casos de uso: media uploads, backups, assets públicos con dominio custom

#### Semana 07 — Queues: Mensajería Asíncrona
- Producers vs Consumers, handlers `queue`, batch processing
- Dead-letter queues, retry policies, acknowledgment explícito
- Fan-out: un producer, múltiples consumers
- Queues + D1: procesamiento diferido de eventos
- Casos de uso: emails transaccionales, resize de imágenes, webhooks entrantes

#### Semana 08 — Durable Objects: Estado Consistente en el Edge
- El problema del estado distribuido — por qué KV no alcanza
- Actor model: single-threaded, consistent, geolocalizable
- Storage API: `put` / `get` / `delete` / `list` con transacciones
- WebSockets over Durable Objects — chat en tiempo real
- Alarms API + **Durable Object Facets** (novedad abril 2026)

#### Semana 09 — Hyperdrive y Bases de Datos Externas
- El problema de cold connections en serverless con bases relacionales
- Hyperdrive: connection pooling, query caching, reducción de latencia
- Conectar Workers a PostgreSQL/MySQL (Neon, Supabase, PlanetScale)
- Turso (libSQL) como alternativa edge-native a D1
- Patrón de migración: de monolito a arquitectura Workers + Hyperdrive

---

### Etapa 2 — AI en el Edge (Semanas 10–14)

#### Semana 10 — Workers AI: Inferencia sin GPU propia
- Catálogo de modelos: LLM (Llama 3, Mistral), embeddings, image gen, speech-to-text
- Binding `@cloudflare/ai`, streaming de respuestas SSE
- Text generation, summarization, translation en Workers
- Image classification y object detection
- Costos, latencia y límites — cuándo usar Workers AI vs APIs externas

#### Semana 11 — Vectorize: Vector Database
- Embeddings: qué son, cómo se generan, por qué funcionan
- Crear índices, insertar vectores, dimensiones, métricas (cosine, dot, euclidean)
- Workers AI + Vectorize: generar y almacenar embeddings en un pipeline
- Búsqueda semántica: `query()`, `topK`, filtrado por metadata
- Actualizaciones e invalidación de vectores

#### Semana 12 — AI Gateway: Proxy Inteligente
- AI Gateway: qué resuelve (observabilidad, caching, fallback)
- Routing unificado: OpenAI, Anthropic, Gemini, Workers AI, Hugging Face
- Caching de respuestas AI — ahorro de costos en queries repetidos
- Rate limiting por provider, request logs y analytics
- Fallback automático entre providers ante errores/timeout

#### Semana 13 — Proyecto RAG Completo
- Arquitectura: R2 (docs) → Worker (chunking) → Workers AI (embeddings) → Vectorize → D1 (metadata)
- Query pipeline: embed consulta → búsqueda vectorial → augment prompt → generar respuesta
- Streaming SSE desde Worker al cliente (Hono + SSE)
- Evaluación de relevancia y métricas del pipeline
- Deploy a producción con custom domain

#### Semana 14 — Cloudflare Agents (novedad 2026)
- Cloudflare Agents: primitivo de primera clase para AI agents sobre Workers
- `Agent` class: memoria persistente via Durable Objects, tool use, multi-step reasoning
- Integración MCP (Model Context Protocol) — conectar herramientas externas
- Agents + Workers AI + Vectorize: agent con memoria semántica
- Casos de uso: customer support agent, code review agent, research agent

---

### Etapa 3 — Full-Stack y Arquitecturas Avanzadas (Semanas 15–18)

#### Semana 15 — Pages, Workers Assets y CI/CD
- Cloudflare Pages vs Workers con Assets — diferencias clave post-2024
- Workers Assets: reemplaza Workers Sites, sirve estáticos con Workers
- Deploy de apps Astro / TanStack Start en Pages con GitHub Actions *(intersección con bc-astro y bc-tanstack)*
- Preview deployments, rollback, custom domains, SSL automático
- Pages Functions vs Workers independientes — cuándo usar cada uno

#### Semana 16 — Service Bindings y RPC (novedad 2024)
- Service Bindings: Worker-to-Worker sin HTTP, sin egress
- RPC sobre Service Bindings — llamadas type-safe entre Workers
- `WorkerEntrypoint`, `RpcTarget`, `using` para resource cleanup
- Patrón microservicios edge: `auth-worker`, `api-worker`, `db-worker`
- **Dynamic Workers** (open beta, abril 2026) — ejecución de código generado en runtime

#### Semana 17 — Workers for Platforms
- Multi-tenancy en el edge — el problema que resuelve
- Dispatch Namespaces: deploy del código de los usuarios de tu SaaS
- Outbound Workers: interceptar y controlar requests de Workers de usuarios
- Límites y sandboxing por tenant, custom domains por cliente
- Casos de uso: plataformas extensibles, funciones custom por organización

#### Semana 18 — Workflows: Ejecución Durable
- El problema de orquestación en serverless — steps que fallan a mitad
- Cloudflare Workflows (2024): `WorkflowEntrypoint`, `step.do()`, `step.sleep()`
- Retry automático por step, idempotencia, estado persistente
- Actividades de larga duración: días, semanas, human-in-the-loop
- Workflows + Queues + D1: pipelines de datos robustos y tolerantes a fallos

---

### Etapa 4 — Producción y Plataforma (Semanas 19–21)

#### Semana 19 — Observabilidad y Testing
- `wrangler tail` — logs en tiempo real en desarrollo y producción
- Tail Workers: procesamiento programático de logs (filtrar, enrutar, alertar)
- Workers Analytics Engine: métricas custom con SQL interface
- Logpush: exportar logs a Datadog, Grafana Cloud, R2, S3
- Workers Vitest — unit e integration testing con Miniflare

#### Semana 20 — Seguridad en Workers
- OWASP Top 10 en el contexto de Workers/edge
- Secrets y variables de entorno — `wrangler secret put`, `.dev.vars`
- Rate Limiting programático desde Workers
- Validación y sanitización de inputs con Zod en el edge
- mTLS, Cloudflare Access (Zero Trust) para proteger Workers internos
- Content Security Policy, headers de seguridad con Hono middleware

#### Semana 21 — Proyecto Final: Plataforma Completa
- Arquitectura de referencia: Workers + D1 + R2 + Queues + Workflows + AI
- Diseño de dominios únicos por aprendiz *(política anticopia)*
- Deploy a producción: custom domains, SSL, performance tuning
- CI/CD con GitHub Actions + Wrangler — staging y production environments
- Presentación, code review entre pares y retrospectiva del bootcamp

---

## 🛠️ Stack Tecnológico

| Herramienta | Versión | Rol |
|-------------|---------|-----|
| Cloudflare Workers | Runtime 2026 | Plataforma principal |
| Wrangler | 3.x | CLI — dev, deploy, migraciones |
| Hono | 4.x | Framework HTTP para Workers |
| DrizzleORM | latest stable | ORM type-safe para D1 |
| TypeScript | 5.x | Lenguaje principal |
| Workers Vitest | latest | Testing (unit + integration) |
| GitHub Actions | — | CI/CD |
| VS Code | — | Editor recomendado |

---

## 🔗 Intersecciones con bc-astro y bc-tanstack

| Semana | Intersección |
|--------|-------------|
| 15 | Deploy de apps Astro y TanStack Start en Pages/Workers Assets |
| 16 | RPC entre Workers como backend type-safe para TanStack Query |
| 13–14 | RAG + Agent con frontend en Astro consumiendo Worker AI |

Estas semanas actúan como **integradores cross-bootcamp** — no duplican
contenido, sino que aplican el stack en conjunto.

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 22+
- pnpm (gestor de paquetes)
- Cuenta Cloudflare (free tier es suficiente para semanas 1–18)
- Git y VS Code con extensiones recomendadas (`.vscode/extensions.json`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/ergrato-dev/bc-cloudflare.git
cd bc-cloudflare
```

### 2. Instalar Wrangler

```bash
pnpm add -g wrangler
wrangler login
```

### 3. Navegar al contenido

```bash
# Ir a la primera semana
cd bootcamp/week-01-la_red_de_cloudflare_y_wrangler

# Ver instrucciones
cat README.md
```

---

## 📊 Metodología de Aprendizaje

### Estrategias Didácticas

- 🎯 **Aprendizaje Basado en Proyectos (ABP)**
- 🧩 **Práctica Deliberada** — ejercicios de complejidad incremental
- 🔄 **Dominios Únicos** — cada aprendiz trabaja en su dominio asignado
- 👥 **Code Review** entre pares
- 🎮 **Live Coding** con diseño de arquitecturas en tiempo real

### Distribución del Tiempo (8h/semana)

- Teoría: 2–2.5 horas
- Prácticas: 3–3.5 horas
- Proyecto: 2–2.5 horas

### Evaluación

Cada semana incluye tres tipos de evidencias:

1. **Conocimiento 🧠** (30%): Cuestionarios y evaluaciones teóricas
2. **Desempeño 💪** (40%): Workers desplegados y funcionales
3. **Producto 📦** (30%): Proyecto entregable adaptado al dominio asignado

Criterio de aprobación: Mínimo **70%** en cada tipo de evidencia.

---

## 📄 Licencia

Este proyecto está bajo la licencia
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) —
Compartir y adaptar con atribución, sin uso comercial y bajo la misma licencia.

---

## ⚠️ Exención de Responsabilidad

Este repositorio es un recurso educativo de acceso libre, distribuido tal como
está (as-is), sin garantía de ningún tipo.

- El contenido tiene fines exclusivamente educativos.
- Los fragmentos de código están diseñados para entornos de aprendizaje local.
  No deben usarse en producción sin una revisión de seguridad adecuada.
- Las referencias a herramientas y servicios de terceros se incluyen con fines
  informativos.

---

🎓 **Bootcamp Cloudflare — De Cero a Héroe** · De cero a Cloudflare Developer Junior en ~5 meses

[Comenzar Semana 1](bootcamp/week-01-la_red_de_cloudflare_y_wrangler) · [Ver Documentación](docs) · [Reportar Issue](https://github.com/ergrato-dev/bc-cloudflare/issues)

_Hecho con ❤️ para la comunidad de desarrolladores hispanohablantes_
