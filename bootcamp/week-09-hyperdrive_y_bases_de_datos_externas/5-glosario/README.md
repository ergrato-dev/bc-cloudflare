# Glosario — Semana 09: Hyperdrive y Bases de Datos Externas

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## C

**Cacheable query**
Query SQL elegible para ser almacenada en caché por Hyperdrive. Solo las queries
`SELECT` planas (sin transacción, sin funciones no deterministas como `NOW()` o
`RANDOM()`) son cacheables.

**Connection pooling**
Técnica de reutilización de conexiones TCP a la base de datos. En lugar de
abrir y cerrar una conexión por request, Hyperdrive mantiene un grupo de
conexiones persistentes en el PoP más cercano al Worker.

**Connection string**
URL que contiene todos los parámetros para conectarse a PostgreSQL: protocolo,
usuario, contraseña, host, puerto y nombre de base de datos.
Formato: `postgresql://user:pass@host:5432/dbname`

## H

**Hyperdrive**
Servicio de Cloudflare que actúa como proxy de conexión entre Workers y
PostgreSQL. Mantiene un pool de conexiones TCP persistentes en el PoP más
cercano al DB, reduciendo la latencia por establecimiento de conexión.

## L

**localConnectionString**
Propiedad del binding Hyperdrive en `wrangler.jsonc` que indica a `wrangler dev`
a qué base de datos conectarse en entorno local. Se ignora en producción.

## P

**postgres.js**
Driver PostgreSQL para Node.js y entornos edge compatible con Cloudflare Workers
mediante el export `workedge`. Usa template literals como prepared statements,
eliminando el riesgo de SQL injection al interpolar valores.

**PostgreSQL wire protocol**
Protocolo binario TCP utilizado por PostgreSQL. Los V8 Isolates no pueden abrir
conexiones TCP crudas, por lo que necesitan Hyperdrive como intermediario.

**Prepared statement**
Query SQL parametrizada donde los valores son enviados por separado del texto
SQL. Evita SQL injection y permite reutilizar planes de ejecución. `postgres.js`
convierte automáticamente los template literals en prepared statements.

## S

**staleWhileRevalidate**
Configuración de caching en Hyperdrive. Define cuántos segundos adicionales
(después de que expire `maxAge`) puede servirse una respuesta cacheada mientras
se refresca en background.

**Soft delete**
Patrón de eliminación lógica: en lugar de borrar la fila se actualiza
`active = false`. Preserva el historial sin romper integridad referencial.

## T

**TCP socket**
Mecanismo de conexión de red de capa 4 requerido por PostgreSQL. Los Workers no
pueden abrir sockets TCP directamente — Hyperdrive resuelve esta limitación.

## V

**V8 Isolate (limitación TCP)**
Entorno de ejecución de Workers. Los Isolates no pueden abrir sockets TCP crudos,
impidiendo conexiones directas a PostgreSQL. Hyperdrive actúa como proxy resolviendo
esta limitación.

## W

**wrangler hyperdrive create**
Comando de Wrangler para crear un Hyperdrive config en Cloudflare. Recibe el
connection string de PostgreSQL y devuelve un `id` UUID que se usa en
`wrangler.jsonc`. El connection string real nunca va en el código fuente.
