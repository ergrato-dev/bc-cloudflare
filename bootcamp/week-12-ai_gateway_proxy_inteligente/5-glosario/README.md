# Glosario — Semana 12: AI Gateway

Términos clave de la semana, ordenados alfabéticamente.

---

## A

### AI Gateway
Proxy reverso gestionado de Cloudflare que se sitúa entre el Worker y los
proveedores de IA (Workers AI, OpenAI, Anthropic, etc.). Añade observabilidad,
caché, rate limiting y fallback sin cambiar el código del modelo.

---

## C

### Cache HIT
Estado que indica que una respuesta fue servida desde la caché del gateway,
sin llamar al proveedor de IA. Aparece en el header `cf-aig-cache-status: HIT`.

### Cache MISS
Estado que indica que no había respuesta en caché y el gateway llamó al
proveedor. Aparece en `cf-aig-cache-status: MISS`.

### `cacheTtl`
Tiempo en segundos durante el cual una respuesta de IA es considerada válida
en caché. Máximo 2 592 000 (30 días). Se pasa como opción del gateway.

### `cf-aig-cache-status`
Header HTTP de respuesta añadido por AI Gateway. Valores posibles: `HIT`,
`MISS`, `BYPASS`, `EXPIRED`.

---

## F

### Fallback
Mecanismo del endpoint universal que, si el proveedor primario falla o devuelve
un error, enruta la petición al siguiente proveedor del array automáticamente.

---

## G

### Gateway ID
Identificador único (slug) de un gateway dentro de una cuenta Cloudflare.
Se usa en la URL del endpoint: `…/v1/{account_id}/{gateway_id}/…`.

---

## O

### Observabilidad (AI Gateway)
Panel del dashboard que muestra métricas de cada llamada: proveedor, modelo,
latencia, tokens, estado de caché y logs de request/response.

---

## P

### Provider
Servicio de IA que sirve el modelo: `workers-ai`, `openai`, `anthropic`,
`azure-openai`, entre otros. AI Gateway soporta cada proveedor con un sufijo
de URL distinto.

---

## R

### Rate Limiting (AI Gateway)
Límite configurable en el dashboard sobre cuántas peticiones se permiten por
ventana de tiempo (fija o deslizante). Al superarlo, el gateway devuelve 429.

---

## S

### `skipCache`
Opción booleana del gateway que, al ser `true`, ignora la caché y fuerza una
nueva llamada al proveedor de IA. Útil para peticiones que deben ser siempre
frescas.

---

## U

### Universal Endpoint
Endpoint base del gateway (`https://gateway.ai.cloudflare.com/v1/…`) que
acepta un array de proveedores ordenados por prioridad y maneja el fallback
automáticamente.

---

> 🚧 Glosario en desarrollo.
