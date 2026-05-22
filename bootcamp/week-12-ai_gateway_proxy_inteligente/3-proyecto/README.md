# Proyecto Semana 12 — Proxy AI con Observabilidad y Caché

## Descripción

Construye un Worker que actúa como **proxy AI** para tu dominio asignado. El
proxy enruta todas las llamadas de inferencia a través de AI Gateway,
aprovechando caché, métricas y fallback para garantizar disponibilidad.

## Objetivos

1. Crear un gateway en el dashboard y conectarlo al Worker
2. Implementar al menos dos endpoints de inferencia con caché
3. Añadir un endpoint de estadísticas básico (conteo de llamadas en KV)
4. Verificar que el header `cf-aig-cache-status: HIT` aparece en respuestas repetidas

## Distribución del tiempo

| Actividad | Tiempo estimado |
|-----------|----------------|
| Configurar gateway y Worker | 30 min |
| Implementar endpoints de inferencia | 60 min |
| Contador de llamadas en KV | 30 min |
| Pruebas y verificación | 30 min |

---

## Adaptación por dominio

El starter incluye rutas genéricas. Renómbralas y ajusta los system prompts
según tu dominio asignado:

| Dominio | Ruta sugerida | System prompt |
|---------|--------------|---------------|
| Clínica veterinaria | `/diagnose`, `/care-tips` | Asistente veterinario... |
| Escape room | `/hint`, `/puzzle-help` | Guía de acertijos... |
| Marina deportiva | `/weather-advice`, `/safety-tips` | Asesor náutico... |
| Librería | `/book-recommend`, `/summary` | Experto en literatura... |

---

## Estructura del starter

```
starter/
├── wrangler.jsonc   — binding AI, binding KV, var GATEWAY_ID
├── package.json
├── .npmrc
├── tsconfig.json
└── src/
    └── index.ts     — rutas con TODOs para implementar
```

---

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| Gateway creado y conectado | 20 |
| Endpoint de inferencia con caché (`cacheTtl`) | 25 |
| Endpoint de inferencia con `skipCache` | 20 |
| Contador de llamadas en KV | 20 |
| Adaptación al dominio (system prompt coherente) | 15 |
| **Total** | **100** |
