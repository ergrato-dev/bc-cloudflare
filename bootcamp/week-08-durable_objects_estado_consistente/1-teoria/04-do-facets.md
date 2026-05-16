# DO Facets — Múltiples Clases en un Namespace

## Objetivos

- Entender qué son los DO Facets y cuándo usarlos
- Declarar múltiples clases DO que comparten el mismo almacenamiento
- Diferenciar cuándo usar Facets vs DOs completamente separados

## 1. Qué es un DO Facet

Un Facet permite que un mismo `DurableObjectId` exponga **comportamientos
distintos** según qué clase accede a él. Comparten el mismo almacenamiento
subyacente pero implementan lógica independiente.

Introducidos en 2024 como alternativa a la proliferación de clases DO que
terminaban duplicando estado.

## 2. Estructura de un Facet

```typescript
// Clase principal — vista de usuario
export class ResourceDO implements DurableObject {
  constructor(private state: DurableObjectState, _env: Env) {}

  async fetch(request: Request): Promise<Response> {
    const count = (await this.state.storage.get<number>("count")) ?? 0;
    return Response.json({ count });
  }
}

// Facet admin — mismo storage, distinta lógica
export class ResourceAdminDO implements DurableObject {
  constructor(private state: DurableObjectState, _env: Env) {}

  async fetch(request: Request): Promise<Response> {
    await this.state.storage.deleteAll();
    return Response.json({ reset: true });
  }
}
```

## 3. Declarar facets en wrangler.jsonc

```jsonc
{
  "durable_objects": {
    "bindings": [
      { "name": "RESOURCE_DO", "class_name": "ResourceDO" },
      { "name": "RESOURCE_ADMIN_DO", "class_name": "ResourceAdminDO" }
    ]
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["ResourceDO", "ResourceAdminDO"]
    }
  ]
}
```

> Usa `new_sqlite_classes` para DOs con SQLite Storage (formato recomendado 2024+).

## 4. Uso desde el Worker

```typescript
// Mismo nombre → mismo ID → mismo storage subyacente
const id = c.env.RESOURCE_DO.idFromName(resourceId);
const adminId = c.env.RESOURCE_ADMIN_DO.idFromName(resourceId);

// Operación de usuario
const stub = c.env.RESOURCE_DO.get(id);

// Operación de admin — mismos datos, diferente lógica
const adminStub = c.env.RESOURCE_ADMIN_DO.get(adminId);
```

## 5. Facets vs DOs separados

| Criterio | Facets | DOs separados |
|----------|--------|---------------|
| Comparten almacenamiento | ✅ | ❌ |
| Lógica independiente | ✅ | ✅ |
| Ideal para | Admin + User del mismo recurso | Recursos distintos |

## ✅ Checklist

- [ ] ¿Qué comparten dos facets del mismo ID?
- [ ] ¿Cuándo conviene Facets en lugar de dos DOs completamente separados?
- [ ] ¿Qué diferencia hay entre `new_classes` y `new_sqlite_classes` en migrations?
- [ ] ¿Pueden dos Facets tener handlers `alarm()` independientes para el mismo ID?

## Referencias

- [DO Facets](https://developers.cloudflare.com/durable-objects/best-practices/do-facets/)
- [SQLite Storage](https://developers.cloudflare.com/durable-objects/api/storage-api/)
