# Semana 02 — V8 Isolates y el Runtime de Workers

> **Etapa 0 — Fundamentos del Edge** · Bootcamp Cloudflare De Cero a Héroe

---

## 🎯 Objetivos

Al finalizar esta semana serás capaz de:

1. Explicar el lifecycle de un V8 Isolate (cold start → warm → retire) y por qué Workers no tiene el cold start de los contenedores
2. Activar `nodejs_compat_v2` y usar módulos Node.js (`crypto`, `buffer`) dentro de un Worker
3. Conocer los límites del runtime (CPU time, memoria, bundle size, subrequests) y cómo monitorearlos
4. Implementar error handling global con `HTTPException` y middleware de logging en Hono

---

## ⏱️ Distribución del tiempo (8h)

| Bloque | Actividad | Horas |
|--------|-----------|-------|
| Teoría | Conceptos fundamentales | 2.0h |
| Práctica | Ejercicios guiados | 3.0h |
| Proyecto | Proyecto integrador | 2.5h |
| Recursos | Revisión y referencias | 0.5h |

---

## 🗂️ Contenido

- [📖 Teoría](1-teoria/)
- [💻 Prácticas](2-practicas/)
- [📦 Proyecto](3-proyecto/)
- [📚 Recursos](4-recursos/)
- [📝 Glosario](5-glosario/)
- [📊 Rúbrica](rubrica-evaluacion.md)

---

## ✅ Checklist de Entrega

- [ ] Ejercicios completados con Worker deployado
- [ ] Proyecto adaptado al dominio asignado y deployado
- [ ] URL de producción Cloudflare entregada
- [ ] Evidencias del cuestionario completadas
