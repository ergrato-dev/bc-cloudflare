# Glosario — Semana 11

> **Vectorize: Vector Database en el Edge**

Términos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.

---

## A

**ANN (Approximate Nearest Neighbor)**
Algoritmo de búsqueda que encuentra los vectores más similares a una consulta
sin recorrer todos los vectores del índice. Vectorize lo usa para escalar a
millones de vectores manteniendo baja latencia.

## C

**cosine similarity**
Métrica que mide el ángulo entre dos vectores. Rango 0–1 para embeddings de
texto normalizados. Un score > 0.85 indica alta similitud semántica.

## D

**dimensions (dimensiones)**
Número de componentes de un vector. Debe coincidir entre el índice Vectorize
y el modelo de embeddings. `@cf/baai/bge-base-en-v1.5` genera 768 dimensiones.

## E

**embedding**
Representación numérica de texto (u otro contenido) como vector de alta
dimensión. Vectores cercanos indican contenido semánticamente similar.
Generados con el binding `AI` y el modelo `bge-base-en-v1.5`.

## I

**index (índice Vectorize)**
Colección de vectores con una métrica y dimensionalidad fija. Se crea con
`wrangler vectorize create <nombre> --dimensions=N --metric=<métrica>` y
se vincula al Worker mediante el binding `VectorizeIndex`.

## M

**metadata**
Objeto JSON adjunto a cada vector que permite filtrar resultados de búsqueda.
Solo admite valores escalares: `string`, `number` o `boolean`.

**mutationId**
Identificador único devuelto por `upsert()` y `deleteByIds()` que permite
rastrear la operación de escritura en Vectorize.

## N

**namespace**
Partición lógica dentro de un índice Vectorize. Permite agrupar vectores
(por idioma, cliente, versión) sin crear índices separados.

## T

**topK**
Parámetro de `query()` que controla cuántos vecinos más cercanos se devuelven.
Valores típicos: 3–10 para búsqueda semántica, hasta 20 para recomendaciones.

## U

**upsert**
Operación que inserta un vector si no existe o lo sobreescribe si ya existe.
Método preferido sobre `insert` para evitar errores en cargas repetidas.

## V

**VectorizeIndex**
Tipo TypeScript nativo de `@cloudflare/workers-types` que representa el binding
Vectorize en un Worker. Expone `upsert()`, `query()`, `getByIds()` y `deleteByIds()`.
