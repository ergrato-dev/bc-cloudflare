# Proyecto Semana 02 — V8 Isolates y Runtime de Workers

## Objetivo

Construir un Worker con Hono que aplique todos los conceptos de la semana:

- Error handling global con `HTTPException` y `app.onError`
- Middleware de logging con timing
- Uso de módulos Node.js vía `nodejs_compat_v2`
- Respuestas HTTP semánticamente correctas

---

## Tu dominio

Adapta este Worker a tu **dominio asignado por el instructor**.

Ejemplos de adaptación:
- Clínica veterinaria → `/patients`, `/appointments`, `/records`
- Escape room → `/rooms`, `/bookings`, `/staff`
- Marina deportiva → `/boats`, `/berths`, `/reservations`
- Biblioteca → `/books`, `/members`, `/loans`
- Cafetería → `/menu`, `/orders`, `/products`

---

## Instrucciones

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Iniciar en modo desarrollo

```bash
wrangler dev
```

### 3. Implementar los TODOs en orden

Los TODOs están numerados. Completa cada uno antes de pasar al siguiente.

### 4. Verificar funcionamiento

Prueba cada endpoint con curl o un cliente HTTP:

```bash
# Listar todos los recursos
curl http://localhost:8787/[tu-recurso]

# Obtener por ID
curl http://localhost:8787/[tu-recurso]/1

# ID inválido → debe devolver 400 JSON
curl http://localhost:8787/[tu-recurso]/abc

# ID inexistente → debe devolver 404 JSON
curl http://localhost:8787/[tu-recurso]/99999

# Ruta inexistente → debe devolver 404 JSON
curl http://localhost:8787/ruta-que-no-existe
```

Verifica en la terminal que el middleware de logging imprime una línea
por request con método, path, status y tiempo en ms.

### 5. Deploy

```bash
wrangler deploy
```

Guarda la URL pública para la entrega.

---

## Criterios de evaluación

| Criterio | Puntos |
|----------|--------|
| `app.onError` maneja `HTTPException` y errores genéricos correctamente | 20 |
| Middleware de logging registra todos los requests | 20 |
| `HTTPException` con status correcto (400 vs 404) | 20 |
| `app.notFound` devuelve JSON con el path | 15 |
| Uso de al menos un módulo Node.js de `nodejs_compat_v2` | 15 |
| Worker deployado en Cloudflare con URL de producción | 10 |
