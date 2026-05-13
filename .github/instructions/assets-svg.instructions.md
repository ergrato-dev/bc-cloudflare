---
applyTo: "bootcamp/**/0-assets/**"
---

# Reglas para diagramas SVG (0-assets/)

## Tema visual obligatorio

| Elemento                 | Color                                 |
| ------------------------ | ------------------------------------- |
| Fondo principal          | `#1a1a2e`                             |
| Fondo secundario (cards) | `#16213e`                             |
| Workers / compute        | `#F38020` (naranja Cloudflare)        |
| Databases / storage      | `#003682` (azul Cloudflare)           |
| Texto principal          | `#FFFFFF`                             |
| Texto secundario         | `#A0AEC0`                             |
| Bordes                   | `#2D3748`                             |
| Flechas / conectores     | `#F38020` o `#FFFFFF` según contraste |

## Reglas de diseño

- ✅ **Solo SVG** — nunca PNG para diagramas de arquitectura
- ✅ Tema **dark** en todos los assets
- ❌ **Sin degradés** (gradients) — colores sólidos únicamente
- ✅ Fuentes sans-serif: `Inter`, `Roboto`, `system-ui`
- ❌ **NO usar fuentes serif**
- ✅ Mostrar solo los componentes relevantes al tema de la semana
- ✅ Representar siempre los bindings del Worker (KV, D1, R2, Queues, etc.)

## Nomenclatura de archivos

```
0-assets/
├── arquitectura-worker.svg       # Diagrama principal de la semana
├── flujo-request.svg             # Flujo de una request específica
└── binding-diagram.svg           # Diagrama de bindings cuando hay varios
```

## Qué mostrar en el diagrama

Incluir siempre:

1. El Worker central (rectángulo `#F38020`)
2. Los bindings que usa esa semana (KV, D1, R2, Queues, DO, etc.)
3. El cliente (browser/fetch) que dispara la request
4. Flechas con etiquetas que indiquen el tipo de operación

No incluir:

- Componentes de semanas anteriores no relevantes al tema actual
- Infraestructura de red de Cloudflare (ya se vio en semana 1)
- Detalles internos de implementación que confundan la arquitectura

## Referencia en teoría

Cada diagrama SVG debe ser referenciado al inicio del archivo de teoría
correspondiente, justo después de los objetivos:

```markdown
> ![Diagrama de arquitectura](../0-assets/arquitectura-worker.svg)
```
