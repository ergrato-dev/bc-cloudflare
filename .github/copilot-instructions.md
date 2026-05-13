# 🤖 Instrucciones para GitHub Copilot — bc-cloudflare

## 📋 Contexto del Bootcamp

Este es un **Bootcamp de Cloudflare de Cero a Héroe** estructurado para llevar
a estudiantes desde cero hasta Cloudflare Developer Junior, con énfasis en
Workers y los cambios más recientes de la plataforma (2024–2026).

### 📊 Datos del Bootcamp

- **Repositorio**: `bc-cloudflare`
- **Duración**: 21 semanas (~5 meses)
- **Dedicación semanal**: 8 horas
- **Total de horas**: ~168 horas
- **Nivel de entrada**: Cero (conocimiento básico de JS/TS recomendado)
- **Nivel de salida**: Cloudflare Developer Junior
- **Lenguaje principal**: TypeScript 5.x
- **Framework HTTP**: Hono 4.x
- **CLI**: Wrangler 3.x
- **Plataforma de deploy**: Cloudflare Workers (con Assets)

### 🔗 Bootcamps relacionados

- **bc-astro**: Framework Astro + Cloudflare Pages/Workers Assets
- **bc-tanstack**: TanStack Router + Query + Start + Cloudflare Workers

La semana 15 de este bootcamp actúa como integrador cross-bootcamp con ambos.

---

## 🎯 Objetivos de Aprendizaje

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

---

## 📚 Estructura del Bootcamp

### Distribución por Etapas

#### Etapa 0: Fundamentos del Edge (Semanas 1–4) — 32 horas

- Arquitectura de la red Cloudflare, Anycast, PoPs
- Wrangler v3: dev, deploy, tail, secrets, D1 migrations
- V8 Isolates, `nodejs_compat_v2`, límites del runtime, Smart Placement
- Hono v4: routing, middleware, JWT auth, error handling
- Workers KV: consistencia eventual, TTL, Cache API

#### Etapa 1: Persistencia y Datos (Semanas 5–9) — 40 horas

- D1: SQLite en el edge, DrizzleORM, migraciones, batch statements
- R2: object storage, presigned URLs, multipart upload
- Queues: producers, consumers, DLQ, fan-out patterns
- Durable Objects: actor model, Storage API, WebSockets, Alarms, DO Facets
- Hyperdrive: connection pooling para PostgreSQL/MySQL externos

#### Etapa 2: AI en el Edge (Semanas 10–14) — 40 horas

- Workers AI: LLM, embeddings, image gen, speech-to-text
- Vectorize: índices, búsqueda semántica, filtrado por metadata
- AI Gateway: routing, caching, rate limiting, fallback
- Proyecto RAG: D1 + Vectorize + Workers AI + R2 + streaming SSE
- Cloudflare Agents: `Agent` class, memoria persistente, tool use, MCP

#### Etapa 3: Full-Stack Avanzado (Semanas 15–18) — 32 horas

- Workers Assets (reemplaza Pages Sites), Pages Functions, CI/CD
- Service Bindings + RPC type-safe, Dynamic Workers (open beta 2026)
- Workers for Platforms: Dispatch Namespaces, Outbound Workers, multi-tenant
- Workflows: `WorkflowEntrypoint`, `step.do()`, `step.sleep()`, retry

#### Etapa 4: Producción y Plataforma (Semanas 19–21) — 24 horas

- Tail Workers, Analytics Engine, Logpush, Workers Vitest
- Seguridad OWASP, Rate Limiting, Zod validation, mTLS, Access
- Proyecto Final: arquitectura completa + CI/CD + observabilidad

---

## 🗂️ Estructura de Carpetas

Cada semana sigue esta estructura estándar:

```
bootcamp/week-XX-tema_principal/
├── README.md                 # Descripción y objetivos de la semana
├── rubrica-evaluacion.md     # Criterios de evaluación detallados
├── 0-assets/                 # Diagramas SVG (arquitectura, flujos)
├── 1-teoria/                 # Material teórico (archivos .md numerados)
├── 2-practicas/              # Ejercicios guiados paso a paso
│   └── ejercicio-XX/
│       ├── README.md         # Instrucciones y pasos
│       ├── starter/
│       │   ├── wrangler.jsonc
│       │   ├── src/index.ts  # Worker con TODOs guiados
│       │   └── package.json
│       └── solution/
│           ├── wrangler.jsonc
│           └── src/index.ts
├── 3-proyecto/               # Proyecto semanal integrador
│   ├── README.md
│   └── starter/
│       ├── wrangler.jsonc
│       ├── src/index.ts      # TODOs para implementar
│       └── package.json
├── 4-recursos/               # Recursos adicionales
│   ├── videografia/
│   └── webgrafia/
└── 5-glosario/               # Términos Cloudflare clave (A–Z)
    └── README.md
```

### Carpetas Raíz

- **`assets/`**: Recursos visuales globales (logos, headers, banners)
- **`docs/`**: Documentación general del bootcamp
- **`scripts/`**: Scripts de automatización y utilidades
- **`bootcamp/`**: Contenido semanal del bootcamp

### Orden de Creación de Cada Semana

1. `README.md` — Descripción general, objetivos, distribución del tiempo
2. `rubrica-evaluacion.md` — Tabla de criterios y puntajes
3. `1-teoria/` — Archivos markdown numerados (`01-`, `02-`, …)
4. `0-assets/` — Diagramas SVG vinculados a la teoría
5. `2-practicas/` — Ejercicios con `starter/` + `solution/`
6. `3-proyecto/` — Proyecto integrador semanal
7. `4-recursos/` — Videografía, webgrafía
8. `5-glosario/README.md` — Términos de la semana ordenados A–Z

---

## 🎓 Componentes de Cada Semana

### 1. Teoría (1-teoria/)

- Archivos markdown con explicaciones conceptuales
- Ejemplos TypeScript completos y ejecutables
- Referencia a diagrama SVG al inicio (después de objetivos)
- Referencias a documentación oficial (developers.cloudflare.com)

#### 📏 Límites de Extensión (NON-NEGOTIABLE)

El público objetivo tiene déficit de atención. Textos extensos generan abandono.

| Elemento           | Límite                                          |
| ------------------ | ----------------------------------------------- |
| Líneas por archivo | **Máximo 120**                                  |
| Objetivos          | 3–4 ítems                                       |
| Secciones          | 4–6 secciones numeradas (`## 1.`, `## 2.`…)     |
| Checklist          | **4 ítems** formulados como preguntas concretas |
| Referencias        | 2–3 links                                       |

**Qué NO incluir en teoría:**

- ❌ Tablas de comparación de más de 4 filas
- ❌ Secciones de "Herramientas recomendadas" (van en `4-recursos/`)
- ❌ Más de 2 ejemplos de código por sección
- ❌ Notas de compatibilidad extensas (una línea `>` es suficiente)

### 2. Prácticas (2-practicas/)

Los ejercicios son **Workers con TODOs guiados** — el estudiante completa
implementaciones parciales, no escribe desde cero.

#### Formato de Ejercicios

**README.md del ejercicio:**

```markdown
### Paso 1: Nombre del Concepto

Explicación del concepto con ejemplo:

\`\`\`typescript
// Ejemplo explicativo
app.get('/ruta', (c) => {
return c.json({ mensaje: 'ejemplo' })
})
\`\`\`

**Abre `starter/src/index.ts`** y completa el TODO correspondiente.
```

**starter/src/index.ts:**

```typescript
// ============================================
// PASO 1: Nombre del Concepto
// ============================================

// TODO: Registra la ruta GET /items que devuelva
// los ítems del KV namespace como JSON
// Hint: usa c.env.KV.get() y JSON.parse()
app.get("/items", async (c) => {
  // TODO: implementar
});
```

**solution/src/index.ts:**

```typescript
// ============================================
// PASO 1: Nombre del Concepto
// ============================================

app.get("/items", async (c) => {
  const raw = await c.env.KV.get("items");
  const items = raw ? JSON.parse(raw) : [];
  return c.json(items);
});
```

#### ❌ NO usar este formato en ejercicios:

```typescript
// ❌ INCORRECTO — demasiado abierto sin guía
// Implementa el endpoint de items
```

#### ✅ Usar este formato en ejercicios:

```typescript
// ✅ CORRECTO — TODO con hint concreto
// TODO: Registra la ruta GET /items
// Hint: usa c.env.KV.get('items') y c.json()
```

### 3. Proyecto (3-proyecto/)

A diferencia de los ejercicios, el proyecto tiene TODOs más abiertos para que
el estudiante diseñe desde su dominio asignado.

**Las instrucciones deben ser genéricas y adaptables a cualquier dominio.**

#### 🏛️ Política de Dominios Únicos (Anticopia)

**Cada aprendiz recibe un dominio único asignado por el instructor.**

Reglas de asignación:

- Un dominio por aprendiz por trimestre — aplica a todos sus bootcamps simultáneos
- Los dominios marcados `★` en el catálogo están **reservados para ejemplos**
  del bootcamp — **no asignar a aprendices**
- Los starters del proyecto **NO deben usar dominios marcados `★`**

#### Formato del starter del proyecto:

```typescript
// ============================================
// PROYECTO SEMANAL: [Título Genérico]
// Semana XX — [Tema]
// ============================================
//
// NOTA PARA EL APRENDIZ:
// Adapta este Worker a tu dominio asignado.
// Ejemplos de adaptación según dominio:
//   Clínica veterinaria → /animals, /appointments
//   Escape room         → /rooms, /bookings
//   Marina deportiva    → /boats, /berths

// TODO: Configura el binding de tu recurso de datos
// TODO: Implementa la ruta principal de listado
// TODO: Implementa la ruta de creación con validación Zod
```

### 4. Recursos (4-recursos/)

- **videografia/**: Videos del blog Cloudflare, CloudflareTV, YouTube
- **webgrafia/**: Documentación oficial, blog posts, referencias

### 5. Glosario (5-glosario/)

- Términos Cloudflare ordenados alfabéticamente
- Definiciones claras y concisas
- Ejemplos de código cuando aplique

---

## 📝 Convenciones de Código TypeScript

### Estilo

```typescript
// ✅ BIEN — tipos explícitos, snake_case para variables de entorno
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

const itemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

app.post("/items", zValidator("json", itemSchema), async (c) => {
  const { name, description } = c.req.valid("json");
  const result = await c.env.DB.prepare(
    "INSERT INTO items (name, description) VALUES (?, ?) RETURNING id",
  )
    .bind(name, description ?? null)
    .first<{ id: number }>();
  return c.json({ id: result?.id }, 201);
});

export default app;
```

### Reglas de Nomenclatura

- **Archivos**: `kebab-case` (`auth-middleware.ts`, `user-handler.ts`)
- **Variables/funciones**: `camelCase`
- **Tipos/interfaces**: `PascalCase`
- **Bindings en `wrangler.jsonc`**: `SCREAMING_SNAKE_CASE`
- **Tablas D1**: `snake_case` plural en inglés (`items`, `user_sessions`)
- **Rutas API**: `kebab-case` (`/user-sessions`, `/auth/refresh`)

### wrangler.jsonc

```jsonc
{
  "name": "nombre-del-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat_v2"],
  // Siempre especificar fecha de compatibilidad exacta
  // Nunca usar "latest" o fechas futuras
}
```

---

## 🌐 Idioma y Nomenclatura

### ⚠️ REGLA CRÍTICA: Inglés Técnico + Español Educativo

**NOMENCLATURA TÉCNICA: SIEMPRE EN INGLÉS**

- ✅ Nombres de variables, funciones, clases, interfaces
- ✅ Nombres de archivos `.ts`, `.jsonc`
- ✅ Rutas API (`/items`, `/auth/refresh`)
- ✅ Nombres de tablas D1 y columnas

**COMENTARIOS Y DOCUMENTACIÓN: SIEMPRE EN ESPAÑOL**

- ✅ Comentarios TypeScript (`// comentario`)
- ✅ READMEs y documentación
- ✅ TODOs y hints en ejercicios
- ✅ Explicaciones educativas

### Ejemplos Correctos

```typescript
// ✅ CORRECTO — Nomenclatura en inglés, comentarios en español
// Obtiene todos los artículos activos del KV namespace
app.get("/articles", async (c) => {
  const raw = await c.env.KV.get("articles:active");
  const articles = raw ? JSON.parse(raw) : [];
  return c.json(articles);
});
```

---

## 🎨 Recursos Visuales y Estándares de Diseño

### Formato de Assets

- ✅ **Preferir SVG** para todos los diagramas (arquitectura, flujos, binding)
- ❌ **NO usar ASCII art** para diagramas o visualizaciones
- ✅ Usar PNG/JPG solo para screenshots

### Tema Visual

- 🌙 **Tema dark** para todos los assets visuales
- ❌ **Sin degradés** (gradients) en diseños
- ✅ Paleta base: `#F38020` (naranja Cloudflare), `#003682` (azul Cloudflare)
- ✅ Fondos: `#1a1a2e` y `#16213e`

### Tipografía

- ✅ **Fuentes sans-serif** exclusivamente (Inter, Roboto, System UI)
- ❌ **NO usar fuentes serif**

---

## 🔐 Mejores Prácticas

### Seguridad en Workers

- **NUNCA** construir queries D1 con concatenación de strings (SQL Injection)
- Usar siempre **prepared statements** con `?` placeholders en D1
- **Validar inputs** con Zod en todos los endpoints que reciben datos
- **Nunca** exponer secrets en logs (`wrangler tail` los vería)
- Usar `wrangler secret put` para credenciales — nunca en `wrangler.jsonc`
- Usar principio de mínimo privilegio en bindings

### Calidad de Código

- Usar TypeScript estricto (`strict: true` en `tsconfig.json`)
- Tipar los `Bindings` del Worker explícitamente
- Usar `zValidator` de `@hono/zod-validator` en todos los endpoints de mutación
- Devolver errores HTTP semánticamente correctos (400 vs 422 vs 500)

### Rendimiento

- Cachear respuestas con `Cache API` cuando el contenido es estático
- Usar `waitUntil` para tareas no críticas post-respuesta
- Evitar `await` en serie cuando las operaciones son independientes (usar `Promise.all`)
- Revisar `subrequest limit` (1000 por invocación en Workers)

---

## 📊 Evaluación

Cada semana incluye **tres tipos de evidencias**:

1. **Conocimiento 🧠** (30%): Cuestionarios sobre conceptos Cloudflare
2. **Desempeño 💪** (40%): Workers desplegados y funcionales (`wrangler deploy`)
3. **Producto 📦** (30%): Proyecto entregable funcional adaptado al dominio

### Criterios de Aprobación

- Mínimo **70%** en cada tipo de evidencia
- Worker deployado en cuenta del aprendiz (URL de producción requerida)
- Implementación coherente con el dominio asignado
- **Originalidad**: Sin copia de implementaciones de otros aprendices

---

## 🚀 Metodología de Aprendizaje

### Estrategias Didácticas

- **Aprendizaje Basado en Proyectos (ABP)**: Proyectos semanales con casos reales
- **Dominios Únicos**: Cada aprendiz aplica conceptos a su dominio asignado
- **Práctica Deliberada**: Workers de complejidad incremental
- **Code Review**: Revisión de código entre estudiantes
- **Live Coding**: Sesiones en vivo con diseño de arquitecturas en tiempo real

### Distribución del Tiempo (8h/semana)

- **Teoría**: 2–2.5 horas
- **Prácticas**: 3–3.5 horas
- **Proyecto**: 2–2.5 horas

---

## 🤖 Instrucciones para Copilot

### Límites de Respuesta

1. **Divide respuestas largas**
   - ❌ **NUNCA generar respuestas que superen los límites de tokens**
   - ✅ **SIEMPRE dividir contenido extenso en múltiples entregas**
   - ✅ Crear contenido por secciones, esperar confirmación del usuario
   - Para semanas completas: dividir por carpetas (`teoria → practicas → proyecto`)

### Generación de Código TypeScript

1. **Usa siempre el estilo definido**
   - TypeScript estricto con tipos explícitos
   - Hono como framework — nunca vanilla `fetch` handler para proyectos con routing
   - Zod para validación en todos los endpoints de mutación

2. **Bindings siempre tipados**

   ```typescript
   // ✅ SIEMPRE — tipar Bindings explícitamente
   type Bindings = {
     DB: D1Database;
     KV: KVNamespace;
   };
   const app = new Hono<{ Bindings: Bindings }>();
   ```

3. **wrangler.jsonc siempre con `compatibility_date` exacta**
   - Nunca usar `"latest"` o fechas futuras
   - Siempre incluir `"nodejs_compat_v2"` en `compatibility_flags`

4. **D1 — prepared statements siempre**

   ```typescript
   // ✅ SIEMPRE — prepared statements
   const result = await c.env.DB.prepare("SELECT * FROM items WHERE id = ?")
     .bind(id)
     .first();

   // ❌ NUNCA — concatenación de strings
   const result = await c.env.DB.prepare(
     `SELECT * FROM items WHERE id = ${id}`,
   ).first();
   ```

5. **Pinning de dependencias (NON-NEGOTIABLE)**
   - ❌ NUNCA usar `^`, `~`, `>=`, `*` en `package.json`
   - ✅ SIEMPRE versión exacta: `"hono": "4.7.4"`
   - Usar `pnpm add paquete@X.Y.Z` siempre

### Creación de Contenido

1. **Estructura clara y progresiva**
   - De lo simple a lo complejo
   - Conceptos construidos sobre conocimientos previos
   - Repetición espaciada: KV aparece en S4, reaparece en S13 (RAG cache)

2. **Ejemplos del mundo real**
   - Casos que un developer encontrará en trabajo real
   - Datos de prueba realistas (no `foo`, `bar`, `test1`)
   - Errores comunes que los estudiantes cometerán (y cómo evitarlos)

3. **Volumen mínimo en starters (NON-NEGOTIABLE)**
   - Semanas 01–04: datos de prueba mínimo 10 ítems en arrays/KV
   - Semanas 05–09: tablas D1 con mínimo 20 filas en seed
   - Semanas 10–21: datasets representativos (mínimo 50 filas en D1)

4. **Diagramas de arquitectura (assets SVG)**
   - Representar siempre los bindings del Worker (KV, D1, R2, etc.)
   - Tema dark: fondo `#1a1a2e`, Workers `#F38020`, databases `#003682`
   - Mostrar solo los componentes relevantes al tema de la semana

### Novedades 2024–2026 — Prioridad de Cobertura

Estas features son el diferencial del bootcamp respecto a contenido antiguo:

| Feature                     | Semana | Prioridad |
| --------------------------- | ------ | --------- |
| `nodejs_compat_v2`          | 2      | Alta      |
| Hono v4 RPC client          | 3      | Alta      |
| D1 + DrizzleORM             | 5      | Alta      |
| Queues (GA)                 | 7      | Alta      |
| Durable Object Facets       | 8      | Media     |
| Workflows                   | 18     | Alta      |
| Cloudflare Agents + MCP     | 14     | Alta      |
| Service Bindings RPC        | 16     | Alta      |
| Dynamic Workers (open beta) | 16     | Media     |
| Workers Vitest              | 19     | Alta      |

---

## 📚 Referencias Oficiales

- **Cloudflare Docs**: https://developers.cloudflare.com/workers/
- **Hono Docs**: https://hono.dev/
- **DrizzleORM + D1**: https://orm.drizzle.team/docs/get-started/d1-new
- **Workers Vitest**: https://developers.cloudflare.com/workers/testing/vitest-integration/
- **Cloudflare Blog**: https://blog.cloudflare.com/
- **Cloudflare Changelog**: https://developers.cloudflare.com/changelog/

---

## 🔗 Enlaces Importantes

- **Repositorio**: https://github.com/ergrato-dev/bc-cloudflare
- **Documentación general**: [docs/README.md](docs/README.md)
- **Primera semana**: [bootcamp/week-01-la_red_de_cloudflare_y_wrangler/README.md](bootcamp/week-01-la_red_de_cloudflare_y_wrangler/README.md)

---

## ✅ Checklist para Nuevas Semanas

Cuando crees contenido para una nueva semana:

- [ ] Crear estructura de carpetas completa
- [ ] `README.md` con objetivos, estructura y navegación
- [ ] Material teórico en `1-teoria/` (máx. 120 líneas por archivo)
- [ ] Diagrama SVG en `0-assets/` (mínimo 1 por semana)
- [ ] Ejercicios prácticos en `2-practicas/` (mínimo 2 ejercicios)
- [ ] Proyecto integrador en `3-proyecto/`
- [ ] `wrangler.jsonc` con `compatibility_date` exacta y `nodejs_compat_v2`
- [ ] `package.json` con versiones exactas (sin `^` ni `~`)
- [ ] Recursos adicionales en `4-recursos/`
- [ ] Glosario de términos en `5-glosario/`
- [ ] Rúbrica de evaluación
- [ ] Verificar coherencia con semanas anteriores
- [ ] Probar que los Workers del starter/solution hacen `wrangler dev` sin errores
- [ ] Verificar que no hay SQL Injection en queries D1

---

## 💡 Notas Finales

- **Prioridad**: Claridad sobre brevedad
- **Enfoque**: Workers prácticos sobre teoría abstracta
- **Objetivo**: Developers listos para desplegar en Cloudflare en producción
- **Filosofía**: Workers estándar primero, optimizaciones de plataforma después

---

_Última actualización: Mayo 2026_
_Versión: 1.0_
