---
description: Genera el diagrama SVG de arquitectura para una semana del bootcamp
---

Genera el diagrama SVG de arquitectura para la **Semana ${input:semana}** del bootcamp bc-cloudflare.

**Tema:** ${input:tema}
**Bindings del Worker esta semana:** ${input:bindings}
**Nombre del archivo:** ${input:nombre_archivo}.svg

## Paleta obligatoria

| Elemento             | Color     |
| -------------------- | --------- |
| Fondo                | `#1a1a2e` |
| Cards / contenedores | `#16213e` |
| Workers / compute    | `#F38020` |
| Databases / storage  | `#003682` |
| Texto                | `#FFFFFF` |
| Bordes               | `#2D3748` |
| Flechas              | `#F38020` |

## Reglas de diseño

- Tema **dark**, sin degradés, colores sólidos
- Fuente: `system-ui, -apple-system, sans-serif`
- Mostrar solo los componentes relevantes a esta semana
- El Worker debe estar en el centro del diagrama
- Cada binding conectado al Worker con flecha etiquetada
- El cliente (Browser / Fetch) en el lado izquierdo
- Cloudflare Edge (opcional) como contenedor del Worker

## Qué incluir en el diagrama

1. **Cliente** → flecha `HTTPS Request` → **Worker** (`#F38020`)
2. **Worker** → flechas hacia cada binding de la semana
3. Etiquetas en las flechas indicando la operación (READ, WRITE, QUERY, PUBLISH, etc.)
4. Leyenda mínima si hay más de 3 tipos de componentes

## Salida esperada

SVG válido, autocontenido (sin dependencias externas), con `viewBox` definido,
listo para embeber en markdown con:

```markdown
![Diagrama](../0-assets/${input:nombre_archivo}.svg)
```
