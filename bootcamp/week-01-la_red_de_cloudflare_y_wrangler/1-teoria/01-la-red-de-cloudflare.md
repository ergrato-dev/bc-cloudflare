# La Red de Cloudflare

> ![Red Anycast de Cloudflare](../0-assets/01-red-anycast.svg)

## Objetivos

- Entender qué es Anycast y por qué reduce la latencia al mínimo
- Distinguir el modelo edge-first del serverless de región única
- Conocer qué pasa físicamente cuando un request llega a un PoP

---

## 1. La red en números

Cloudflare opera una red **Anycast** con más de 300 ciudades en 100 países.
Cada ciudad tiene uno o más **PoPs** (Points of Presence) — datacenters
propios donde se ejecuta el código de los Workers.

> Un Worker no vive en `us-east-1`. Vive en todos los PoPs a la vez.

---

## 2. Anycast: el mismo IP en todas partes

Con Anycast, la misma dirección IP es anunciada desde todos los PoPs vía BGP.
El router del ISP del usuario enruta el paquete al PoP más cercano
topológicamente — sin configuración ni geolocalización manual.

```
Usuario Madrid  →  PoP Madrid    (~8 ms)
Usuario Bogotá  →  PoP Bogotá    (~12 ms)
Usuario Tokio   →  PoP Tokio     (~9 ms)
```

---

## 3. Edge-first vs serverless tradicional

| Aspecto | Lambda / Vercel (región única) | Cloudflare Workers |
|---------|-------------------------------|-------------------|
| Latencia típica | 80–300 ms | 5–30 ms |
| Cold start | 100–500 ms | < 5 ms (V8 Isolate) |
| Ubicación | Una región elegida | PoP más cercano |

> Cold starts: en Workers no existen como en Lambda — los Isolates
> arrancan en microsegundos y se reutilizan entre requests.

---

## 4. ¿Qué pasa cuando llega un request?

1. Usuario hace `fetch("https://api.tuworker.workers.dev/items")`
2. DNS resuelve a la IP Anycast de Cloudflare
3. BGP enruta el paquete al PoP más cercano
4. El PoP tiene el Worker compilado listo en un V8 Isolate
5. El handler `fetch` se ejecuta y devuelve la Response

Todo en un solo salto de red desde el usuario al código.

---

## ✅ Checklist

- [ ] ¿Puedo explicar qué es Anycast sin mencionar "Cloudflare"?
- [ ] ¿Sé por qué un Worker en Madrid responde más rápido a un usuario europeo que una Lambda en us-east-1?
- [ ] ¿Entiendo por qué no existe cold start significativo en Workers?
- [ ] ¿Sé qué es un PoP y cuántos tiene Cloudflare?

## Referencias

- [How Cloudflare Works](https://developers.cloudflare.com/fundamentals/concepts/how-cloudflare-works/)
- [Cloudflare Network Map](https://www.cloudflare.com/network/)
