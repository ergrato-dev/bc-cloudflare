# Glosario — Semana 08

> **Durable Objects: Estado Consistente en el Edge**

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## A

**actor model** — Paradigma de computación donde cada actor (DO) es una unidad
aislada con su propio estado. Los actores se comunican mediante mensajes (HTTP
via `stub.fetch()`), eliminando condiciones de carrera sin necesidad de locks.

**alarm()** — Método del DO que Cloudflare invoca automáticamente cuando expira
el timestamp configurado con `setAlarm()`. Garantizada de ejecutarse al menos
una vez aunque el DO esté hibernando.

## D

**deleteAlarm()** — Cancela la alarma activa del DO antes de que se dispare.
Parte de la Storage API: `await this.state.storage.deleteAlarm()`.

**deleteAll()** — Borra absolutamente todo el contenido del Storage del DO. 
Útil para reiniciar el estado de un DO o en tests.

**DurableObject** — Interfaz TypeScript que implementa la clase del DO.
Requiere el método `fetch(request: Request): Promise<Response>`.

**DurableObjectNamespace** — Tipo del binding del DO en el Worker.
Expone `idFromName()`, `newUniqueId()` y `get()`.

**DurableObjectState** — Objeto que Cloudflare pasa al constructor del DO.
Contiene `state.storage` (Storage API), `state.id` y métodos de WebSocket.

## F

**Facet** — Clase DO alternativa que comparte el almacenamiento de otra clase
para el mismo ID. Permite distintas interfaces (user vs admin) sobre los mismos
datos sin duplicar estado.

## H

**Hibernation API** — Mecanismo que permite a un DO "dormir" entre mensajes
WebSocket, reduciendo el coste al cobrar solo por el tiempo activo procesando
mensajes. Usa `state.acceptWebSocket()` en lugar del par tradicional.

## I

**idFromName(name)** — Genera un `DurableObjectId` determinístico a partir de
un string. El mismo nombre siempre produce el mismo ID, garantizando la misma
instancia en cualquier PoP del mundo.

## M

**migration** — Declaración en `wrangler.jsonc` que indica a Cloudflare que
debe aprovisionar almacenamiento para las clases DO listadas. Obligatoria al
crear o renombrar clases DO.

## S

**setAlarm(timestamp)** — Programa una alarma en el timestamp indicado
(milliseconds desde epoch). Si ya existe una alarma, la sobreescribe.
Solo puede haber una alarma activa por DO.

**Storage API** — API clave-valor persistente, aislada por instancia de DO.
Operaciones principales: `get()`, `put()`, `list()`, `delete()`, `transaction()`.

**stub** — Proxy del DO obtenido con `namespace.get(id)`. Las llamadas a
`stub.fetch()` son enrutadas por Cloudflare a la única instancia activa del DO
para ese ID, independientemente del PoP desde donde se origine la petición.

## T

**transaction()** — Método de la Storage API que ejecuta un grupo de
operaciones de forma atómica. Si la función lanza, ninguna escritura se aplica.

## W

**WebSocketPair** — Constructor que crea un par de WebSockets (`[client, server]`).
El client se devuelve al navegador (status 101) y el server se registra en el DO
con `state.acceptWebSocket(server)`.

