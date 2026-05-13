# Ejercicio 02 — DrizzleORM + D1 Type-Safe

Misma funcionalidad de CRUD que el ejercicio anterior, pero ahora usando
**DrizzleORM** para obtener queries type-safe sin escribir SQL a mano.

---

## Contexto

DrizzleORM es un ORM ligero que compila a SQL optimizado para SQLite.
Con el schema TypeScript defines las tablas; `$inferSelect` / `$inferInsert`
generan los tipos automáticamente.

---

### Paso 1: Instalar y revisar el schema

```bash
cd starter
pnpm install

# Las migraciones ya están pre-generadas en migrations/
# Solo aplica localmente:
wrangler d1 migrations apply games-db --local
wrangler d1 execute games-db --local --file=./seed.sql
wrangler dev
```

Revisa `src/db/schema.ts` — ya está definido el schema de `games`.

---

### Paso 2: Listar videojuegos

```typescript
// En index.ts, la conexión ya está creada:
const db = drizzle(c.env.DB);

// Para obtener todos los juegos:
const allGames = await db.select().from(games);

// Con filtro de género:
const byGenre = await db.select().from(games)
  .where(eq(games.genre, genre));
```

**Abre `starter/src/index.ts`** y completa el TODO del Paso 2.
Soporta paginación con `.limit(n).offset(n)`.

---

### Paso 3: Obtener por ID

```typescript
// Destructura el array — si el juego no existe, game es undefined
const [game] = await db.select().from(games)
  .where(eq(games.id, id));

if (!game) throw new HTTPException(404, { message: "Game not found" });
```

**Completa el TODO del Paso 3**.

---

### Paso 4: Crear un juego

```typescript
// .returning() devuelve el registro insertado con su id autoincremental
const [created] = await db
  .insert(games)
  .values(data)
  .returning();
```

**Completa los TODOs de Paso 4** — POST y PUT.

---

### Paso 5: Eliminar

```typescript
await db.delete(games).where(eq(games.id, id));
```

**Completa el TODO del Paso 5**.

---

### Generar migraciones desde el schema (opcional)

Si modificas `src/db/schema.ts`, regenera las migraciones:

```bash
# Genera SQL desde el schema TypeScript
pnpm drizzle-kit generate

# Aplica en local
wrangler d1 migrations apply games-db --local
```

---

### Verificar

```bash
curl http://localhost:8787/games
curl "http://localhost:8787/games?genre=rpg"
curl http://localhost:8787/games/1
curl -X POST http://localhost:8787/games \
  -H "Content-Type: application/json" \
  -d '{"title":"Elden Ring","studio":"FromSoftware","genre":"rpg","platform":"PC","year":2022,"price":59.99}'
```
