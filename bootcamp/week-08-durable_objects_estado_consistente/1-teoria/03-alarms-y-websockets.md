# Alarms y WebSockets en Durable Objects

## Objetivos

- Programar tareas futuras con `storage.setAlarm()` e implementar `alarm()`
- Actualizar el DO periódicamente sin depender de requests HTTP externos
- Gestionar conexiones WebSocket con la Hibernation API

## 1. Alarms — tareas programadas

Un Alarm es una invocación futura garantizada del método `alarm()` del DO.
Útil para resets de ventana temporal, expiración de sesiones o recordatorios.

```typescript
export class ScheduledDO implements DurableObject {
  constructor(private state: DurableObjectState, _env: Env) {}

  async fetch(request: Request): Promise<Response> {
    // Programa la alarma 60 segundos en el futuro
    await this.state.storage.setAlarm(Date.now() + 60_000);
    await this.state.storage.put("window_start", Date.now());
    return Response.json({ scheduled: true });
  }

  // Se invoca automáticamente cuando expira el tiempo
  async alarm(): Promise<void> {
    await this.state.storage.put("window_hits", 0);
    console.log("[alarm] Ventana reseteada");
  }
}
```

> Solo puede haber **una alarma activa** por DO. `setAlarm()` sobreescribe la anterior.

## 2. Cancelar y consultar la alarma

```typescript
// Obtener el timestamp de la próxima alarma (null si no hay)
const next = await this.state.storage.getAlarm();

// Cancelar la alarma activa
await this.state.storage.deleteAlarm();
```

## 3. WebSockets con Hibernation API

La Hibernation API permite que el DO "duerma" entre mensajes WebSocket,
reduciendo coste sin perder conexiones activas.

```typescript
async fetch(request: Request): Promise<Response> {
  if (request.headers.get("Upgrade") !== "websocket") {
    return new Response("Expected WebSocket", { status: 426 });
  }
  const [client, server] = Object.values(new WebSocketPair()) as WebSocket[];
  // acceptWebSocket registra el socket sin bloquear el DO
  this.state.acceptWebSocket(server);
  return new Response(null, { status: 101, webSocket: client });
}

async webSocketMessage(ws: WebSocket, message: string): Promise<void> {
  ws.send(`echo: ${message}`);
}

async webSocketClose(ws: WebSocket): Promise<void> {
  console.log("Cliente desconectado");
}
```

## 4. Comparación

| Característica | Alarms | WebSockets (Hibernation) |
|----------------|--------|--------------------------|
| Activación | Tiempo futuro | Mensaje entrante |
| Coste activo | Solo al disparar | Solo al recibir mensaje |
| Caso de uso | Reset, expiración | Chat, presencia, streaming |

## ✅ Checklist

- [ ] ¿Cuántas alarmas puede tener activas un DO simultáneamente?
- [ ] ¿Qué ocurre si llamas `setAlarm()` cuando ya hay una alarma programada?
- [ ] ¿Qué ventaja ofrece la Hibernation API frente a WebSockets tradicionales?
- [ ] ¿Cómo cancelas una alarma antes de que dispare?

## Referencias

- [Alarms API](https://developers.cloudflare.com/durable-objects/api/alarms/)
- [WebSockets · Hibernation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
