---
description: Genera el contenido completo de una semana del bootcamp bc-cloudflare
---

Genera el contenido de la **Semana ${input:semana}** del bootcamp bc-cloudflare.

**Tema:** ${input:tema}
**Etapa:** ${input:etapa}

Sigue el orden definido en las instrucciones del bootcamp y divide la entrega así:

## Entrega 1 — README.md + rubrica-evaluacion.md

Crea `bootcamp/week-${input:semana}-${input:slug}/README.md` con:

- Descripción y objetivos (3–4 ítems)
- Tabla de distribución del tiempo (8h total)
- Índice de contenidos de la semana
- Enlace a semana anterior y siguiente

Crea `bootcamp/week-${input:semana}-${input:slug}/rubrica-evaluacion.md` con:

- Tabla de criterios: Conocimiento (30%), Desempeño (40%), Producto (30%)
- Indicadores específicos al tema de la semana
- Escala: Excelente / Satisfactorio / En Progreso / Insuficiente

Espera confirmación antes de continuar con la Entrega 2.

## Entrega 2 — 1-teoria/ (cuando se confirme)

Crea los archivos de teoría (`01-`, `02-`, `03-`...) siguiendo las reglas de
`teoria-content.instructions.md`:

- Máximo 120 líneas por archivo
- 4–6 secciones numeradas
- Checklist de 4 preguntas al final
- Ejemplos TypeScript con comentarios en español

Espera confirmación antes de continuar con la Entrega 3.

## Entrega 3 — 2-practicas/ (cuando se confirme)

Crea mínimo 2 ejercicios con estructura `starter/` + `solution/`:

- `starter/src/index.ts`: TODOs guiados con hints concretos
- `solution/src/index.ts`: implementación completa
- `wrangler.jsonc`: con `compatibility_date` exacta y `nodejs_compat_v2`
- `package.json`: versiones exactas sin `^` ni `~`
- Volumen mínimo de datos según la semana

Espera confirmación antes de continuar con la Entrega 4.

## Entrega 4 — 3-proyecto/ + 4-recursos/ + 5-glosario/ (cuando se confirme)

Crea el proyecto integrador con TODOs abiertos (sin dominio específico),
los recursos adicionales y el glosario de términos de la semana.
