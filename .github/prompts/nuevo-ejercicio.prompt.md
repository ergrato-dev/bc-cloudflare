---
description: Genera un ejercicio guiado (starter + solution) para una semana específica
---

Genera el ejercicio **${input:numero}** para la **Semana ${input:semana}** del bootcamp bc-cloudflare.

**Concepto a ejercitar:** ${input:concepto}
**Bindings necesarios:** ${input:bindings}

## Estructura a crear

```
bootcamp/week-${input:semana}-*/2-practicas/ejercicio-${input:numero}/
├── README.md
├── starter/
│   ├── wrangler.jsonc
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
└── solution/
    ├── wrangler.jsonc
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```

## Reglas obligatorias

**README.md:**

- Pasos numerados (`### Paso 1: ...`)
- Cada paso explica el concepto y referencia el TODO correspondiente
- Sección "Cómo ejecutar" con `wrangler dev`

**starter/src/index.ts:**

- TODOs con formato: `// TODO: descripción concreta`
- Hints con formato: `// Hint: usa c.env.BINDING.método()`
- Estructura del Worker completa (imports, type Bindings, Hono app, export)
- Solo las implementaciones de rutas vacías — no el esqueleto en blanco

**solution/src/index.ts:**

- Implementación completa y funcional
- Comentarios en español explicando decisiones de implementación
- Sin TODOs ni hints

**wrangler.jsonc:**

- `compatibility_date`: usar `"2025-01-01"` (ajustar si es necesario)
- `compatibility_flags`: `["nodejs_compat_v2"]`
- Bindings declarados correctamente según el concepto

**package.json:**

- Versiones exactas (sin `^` ni `~`)
- Solo dependencias necesarias para este ejercicio

## Datos de prueba

Incluir datos seed representativos con distribuciones desiguales.
Volumen según semana: S01–04 ≥ 10 ítems | S05–09 ≥ 20 filas | S10–21 ≥ 50 filas.
