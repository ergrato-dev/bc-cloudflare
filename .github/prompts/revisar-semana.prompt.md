---
description: Revisa una semana del bootcamp y verifica que cumple todos los estándares
---

Revisa el contenido de la **Semana ${input:semana}** del bootcamp bc-cloudflare ubicada en:

`bootcamp/week-${input:semana}-${input:slug}/`

## Checklist de revisión

Lee todos los archivos de la semana y verifica cada punto:

### README.md

- [ ] Tiene objetivos (3–4 ítems)
- [ ] Distribución del tiempo suma 8h
- [ ] Incluye índice de contenidos
- [ ] Enlaza semana anterior y siguiente

### 1-teoria/

- [ ] Ningún archivo supera 120 líneas
- [ ] Cada archivo tiene 4–6 secciones numeradas
- [ ] Cada archivo tiene checklist de 4 preguntas concretas
- [ ] Tiene 2–3 referencias oficiales
- [ ] Referencia al SVG de `0-assets/`
- [ ] Comentarios en español, código en inglés

### 0-assets/

- [ ] Existe al menos un SVG
- [ ] Fondo `#1a1a2e`, Workers `#F38020`, DBs `#003682`
- [ ] Sin degradés, fuente sans-serif

### 2-practicas/

- [ ] Al menos 2 ejercicios
- [ ] Cada ejercicio tiene `starter/` y `solution/`
- [ ] `wrangler.jsonc` tiene `compatibility_date` exacta y `nodejs_compat_v2`
- [ ] `package.json` sin `^`, `~`, `>=`, `*`
- [ ] TODOs con hints concretos en starter
- [ ] D1 usa prepared statements (sin interpolación de strings)
- [ ] Inputs validados con Zod donde corresponde
- [ ] Volumen de datos cumple el mínimo de la semana

### 3-proyecto/

- [ ] TODOs genéricos (no atados a un dominio específico)
- [ ] Tiene nota para el aprendiz sobre adaptar al dominio
- [ ] `wrangler.jsonc` y `package.json` correctos

### rubrica-evaluacion.md

- [ ] Tiene las 3 categorías: Conocimiento, Desempeño, Producto
- [ ] Porcentajes: 30% / 40% / 30%
- [ ] Indicadores específicos al tema de la semana

### 5-glosario/

- [ ] Términos ordenados A–Z
- [ ] Definiciones concisas con ejemplos de código cuando aplique

## Reporte final

Para cada punto fallido, indica:

1. Qué archivo tiene el problema
2. Qué línea o sección
3. Corrección exacta a aplicar

Si todo está correcto, confirma con: "✅ Semana ${input:semana} cumple todos los estándares."
