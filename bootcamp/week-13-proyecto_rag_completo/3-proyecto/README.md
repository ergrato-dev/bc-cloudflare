# Proyecto Semana 13 — Sistema RAG de tu Dominio

## Descripción

Construye un sistema RAG completo para tu dominio asignado. El sistema debe
permitir indexar documentos propios de tu dominio y responder preguntas sobre
ellos usando búsqueda semántica y generación de texto con contexto.

## Objetivos

1. Indexar al menos 10 documentos de tu dominio en D1, R2 y Vectorize
2. Responder preguntas semánticamente relevantes usando el pipeline RAG
3. Implementar el endpoint de streaming SSE para respuestas en tiempo real
4. Desplegar el sistema completo en producción

## Adaptación por dominio

| Dominio | Documentos sugeridos | System prompt |
|---------|---------------------|---------------|
| Clínica veterinaria | Fichas de animales, protocolos de cuidado | Eres un asistente veterinario... |
| Escape room | Narrativa de salas, pistas, reglas | Eres el narrador del juego... |
| Marina deportiva | Regulaciones náuticas, guías de embarcaciones | Eres un asesor náutico... |
| Librería | Reseñas de libros, catálogo, géneros | Eres un experto en literatura... |

## Distribución del tiempo

| Actividad | Tiempo estimado |
|-----------|----------------|
| Crear recursos (D1, R2, Vectorize) | 20 min |
| Implementar Worker | 60 min |
| Indexar documentos del dominio | 40 min |
| Pruebas y deploy | 30 min |

---

## Estructura del starter

```
starter/
├── wrangler.jsonc   — todos los bindings: AI + DB + BUCKET + INDEX
├── schema.sql       — CREATE TABLE documents
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
| POST /documents indexa en D1 + R2 + Vectorize | 20 |
| POST /query devuelve respuesta con `sources` | 25 |
| POST /query/stream devuelve `text/event-stream` | 20 |
| Mínimo 10 documentos de tu dominio indexados | 20 |
| System prompt y rutas adaptados al dominio | 15 |
| **Total** | **100** |
