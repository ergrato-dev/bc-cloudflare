---
applyTo: "bootcamp/**/1-teoria/**"
---

# Reglas para archivos de teoría (1-teoria/)

## Límites de extensión (NON-NEGOTIABLE)

| Elemento            | Límite                                           |
| ------------------- | ------------------------------------------------ |
| Líneas por archivo  | **Máximo 120**                                   |
| Objetivos al inicio | 3–4 ítems                                        |
| Secciones numeradas | 4–6 (`## 1.`, `## 2.`…)                          |
| Checklist al final  | **Exactamente 4 ítems** como preguntas concretas |
| Referencias         | 2–3 links oficiales                              |

## Estructura obligatoria de cada archivo de teoría

```markdown
# Título del Tema

> Referencia al diagrama SVG: ![Diagrama](../0-assets/nombre.svg)

## Objetivos

- Objetivo 1
- Objetivo 2
- Objetivo 3

## 1. Primer Concepto

...

## 2. Segundo Concepto

...

## 3. Tercer Concepto

...

## 4. Ejemplo Integrador

...

## ✅ Checklist

- [ ] ¿Pregunta concreta 1?
- [ ] ¿Pregunta concreta 2?
- [ ] ¿Pregunta concreta 3?
- [ ] ¿Pregunta concreta 4?

## Referencias

- [Título](https://developers.cloudflare.com/...)
- [Título](https://hono.dev/...)
```

## Qué NO incluir

- ❌ Tablas de más de 4 filas
- ❌ Más de 2 ejemplos de código por sección
- ❌ Secciones "Herramientas recomendadas" (van en `4-recursos/`)
- ❌ Notas de compatibilidad extensas (máximo una línea `>`)
- ❌ Comparativas exhaustivas de tecnologías alternativas

## Idioma

- Comentarios TypeScript: **español**
- Nombres de variables/funciones/rutas: **inglés**
- Texto explicativo: **español**

## Ejemplo de código en teoría

```typescript
// ✅ Correcto — comentario en español, código en inglés
// Registra la ruta de listado con paginación
app.get("/items", async (c) => {
  const page = Number(c.req.query("page") ?? "1");
  const items = await c.env.DB.prepare("SELECT * FROM items LIMIT 10 OFFSET ?")
    .bind((page - 1) * 10)
    .all();
  return c.json(items.results);
});
```
