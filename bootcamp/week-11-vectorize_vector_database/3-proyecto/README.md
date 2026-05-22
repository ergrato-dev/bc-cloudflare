# Proyecto Semanal — Vectorize: Motor de Búsqueda Semántica

## Descripción

Construye un Worker que actúa como motor de búsqueda semántica para tu dominio
asignado. Los usuarios pueden indexar contenido del dominio y buscarlo con
texto libre en lenguaje natural, sin necesidad de palabras clave exactas.

---

## Objetivo

Adaptar el Worker a tu **dominio asignado** e implementar un pipeline completo:
indexación de contenido del dominio → búsqueda semántica → resultados ordenados.

---

## Ejemplos de adaptación por dominio

| Dominio            | Qué indexar                              | Endpoint principal        |
|--------------------|------------------------------------------|---------------------------|
| Clínica veterinaria| Enfermedades, tratamientos, síntomas     | POST /search (síntomas)   |
| Escape room        | Pistas, descripciones de salas, acertijos| POST /search (temática)   |
| Marina deportiva   | Maniobras, reglas de regata, embarcaciones| POST /search (técnica)   |
| Librería digital   | Sinopsis de libros, géneros, autores     | POST /search (por tema)   |
| Consultorio médico | Procedimientos, síntomas, medicamentos   | POST /search (síntoma)    |

---

## Requisitos

### Mínimos (aprobación)

- [ ] Worker desplegado con bindings `AI` y `VECTORIZE` declarados
- [ ] `POST /documents` — indexa texto con metadata del dominio
- [ ] `POST /search` — búsqueda semántica por texto libre con topK
- [ ] Al menos 20 documentos indexados del dominio asignado
- [ ] Validación Zod en todos los endpoints de entrada

### Avanzados (distinción)

- [ ] `GET /documents/:id` — recupera un documento por ID con metadata
- [ ] `DELETE /documents/:id` — elimina un documento del índice
- [ ] `POST /search` acepta `filter` de metadata para acotar el dominio
- [ ] `GET /health` que devuelve los bindings activos y un test de embedding

---

## Estructura sugerida del starter

El starter incluye los bindings y los schemas. Tú implementas las rutas
adaptadas a tu dominio: nombres de rutas, metadata fields y dataset inicial.

---

## Entrega

1. URL del Worker en producción (`wrangler deploy`)
2. Captura de `POST /documents` indexando al menos 3 documentos del dominio
3. Captura de `POST /search` con una query en lenguaje natural del dominio
4. Captura mostrando el score de similitud de los resultados

---

## Tiempo estimado

**2 – 2.5 horas**

- Crear índice Vectorize: 10 min
- Configurar bindings: 10 min
- Implementar Worker + dataset: 80 – 90 min
- Deploy + pruebas: 20 min
