# Semana 12 — AI Gateway: Proxy Inteligente

> **Etapa 2 — AI en el Edge** · Bootcamp Cloudflare De Cero a Héroe

---

## 🎯 Objetivos

- Crear un gateway en el dashboard de Cloudflare y obtener su URL base
- Enrutar llamadas de Workers AI a través del gateway con caché y logging
- Controlar costos con rate limiting y caché por TTL configurables
- Implementar fallback multi-proveedor con el endpoint universal del gateway

---

## ⏱️ Distribución del tiempo (8h)

| Bloque | Actividad | Horas |
|--------|-----------|-------|
| Teoría | Arquitectura, caché, rate limiting, fallback | 2.0h |
| Práctica | Ejercicios guiados (Workers AI + fallback) | 3.0h |
| Proyecto | Proxy AI del dominio con caché y logging | 2.5h |
| Recursos | Revisión y referencias | 0.5h |

---

## 🗂️ Contenido

| # | Archivo | Tema |
|---|---------|------|
| 01 | [Introducción a AI Gateway](1-teoria/01-ai-gateway-intro.md) | Arquitectura, crear gateway, URL base |
| 02 | [Workers AI con gateway](1-teoria/02-workers-ai-con-gateway.md) | Opción `gateway` en el binding AI |
| 03 | [Caché y rate limiting](1-teoria/03-cache-y-rate-limiting.md) | TTL, skipCache, cost control |
| 04 | [Proveedores externos y fallback](1-teoria/04-proveedores-externos.md) | OpenAI, Anthropic, endpoint universal |

---

## 🗂️ Navegación

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
