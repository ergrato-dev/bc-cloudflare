import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// ============================================
// TODO 1: Define el schema de tu tabla principal
// ============================================
//
// Adapta la tabla al dominio asignado. Ejemplos:
//   Clínica veterinaria → patients (name, species, breed, age, owner_name)
//   Escape room         → rooms (name, theme, capacity, difficulty, price)
//   Marina deportiva    → boats (name, type, length_m, berth, owner_name)
//
// Usa los tipos: text(), integer(), real()
// Siempre incluye: id con primaryKey({ autoIncrement: true })
// Agrega índice para la columna que filtrarás más (género, tipo, categoría)

export const items = sqliteTable("items", {
  id:   integer("id").primaryKey({ autoIncrement: true }),

  // TODO: reemplaza estas columnas con las de tu dominio
  name:     text("name").notNull(),
  category: text("category").notNull(),
  // TODO: agrega las columnas específicas de tu dominio
});

// TODO 2: Exporta los tipos inferidos
// export type Item    = typeof items.$inferSelect;
// export type NewItem = typeof items.$inferInsert;
