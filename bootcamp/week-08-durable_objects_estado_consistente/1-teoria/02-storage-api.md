# Storage API — Estado Persistente en el DO

## Objetivos

- Leer y escribir valores con `storage.get()` y `storage.put()`
- Listar y borrar claves con `list()` y `delete()`
- Usar transacciones con `storage.transaction()` para atomicidad

## 1. get() y put() — operaciones básicas

La Storage API es una clave-valor **aislada por DO** — dos instancias distintas
no comparten datos, aunque tengan las mismas claves.

```typescript
// Leer un valor tipado — null si la clave no existe
const count = (await this.storage.get<number>("count")) ?? 0;

// Escribir — persiste entre invocaciones del DO
await this.storage.put("count", count + 1);

// Leer múltiples claves de golpe — devuelve Map<string, T>
const values = await this.storage.get<number>(["hits", "errors"]);
const hits = values.get("hits") ?? 0;
```

## 2. list() — enumerar claves

```typescript
// Lista todas las claves con prefijo "session:" (paginado)
const sessions = await this.storage.list<string>({ prefix: "session:" });

for (const [key, value] of sessions) {
  console.log(key, value);
}
```

| Opción de `list()` | Descripción |
|--------------------|-------------|
| `prefix` | Filtrar por prefijo de clave |
| `limit` | Máximo de entradas a devolver |
| `start` | Clave de inicio (cursor de paginación) |
| `reverse` | Iterar en orden descendente |

## 3. delete() — borrar una o varias claves

```typescript
// Borrar una clave
await this.storage.delete("count");

// Borrar varias claves de una vez
await this.storage.delete(["hits", "errors", "lastReset"]);

// Borrar absolutamente todo el storage del DO
await this.storage.deleteAll();
```

## 4. transaction() — atomicidad

```typescript
// Las escrituras dentro de transaction() se aplican todas o ninguna
await this.storage.transaction(async (txn) => {
  const balance = (await txn.get<number>("balance")) ?? 0;
  if (balance < 10) throw new Error("Saldo insuficiente");

  await txn.put("balance", balance - 10);

  const log = (await txn.get<string[]>("log")) ?? [];
  await txn.put("log", [...log, new Date().toISOString()]);
});
```

> Si la función de `transaction()` lanza, ninguna escritura se aplica.

## 5. Límites

| Límite | Valor |
|--------|-------|
| Tamaño máx. por valor | 128 KB |
| Tamaño máx. total por DO | 10 GB |
| Operaciones por transacción | 128 |

## ✅ Checklist

- [ ] ¿Qué devuelve `storage.get()` si la clave no existe?
- [ ] ¿Cuándo debes usar `transaction()` en lugar de `put()` directo?
- [ ] ¿Qué diferencia hay entre `list()` y `get()` con array de claves?
- [ ] ¿Qué hace `deleteAll()` y en qué casos lo usarías?

## Referencias

- [Storage API](https://developers.cloudflare.com/durable-objects/api/storage-api/)
- [Durable Objects · Limits](https://developers.cloudflare.com/durable-objects/platform/limits/)
