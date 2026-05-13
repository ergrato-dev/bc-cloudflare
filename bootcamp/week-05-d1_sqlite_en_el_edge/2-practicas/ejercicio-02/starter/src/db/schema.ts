import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Schema de la tabla games — DrizzleORM genera el SQL desde esta definición
export const games = sqliteTable("games", {
  id:       integer("id").primaryKey({ autoIncrement: true }),
  title:    text("title").notNull(),
  studio:   text("studio").notNull(),
  genre:    text("genre").notNull(),
  platform: text("platform").notNull(),
  year:     integer("year").notNull(),
  price:    real("price").notNull(),
  inStock:  integer("in_stock", { mode: "boolean" }).default(true),
});

// Tipos inferidos del schema — sin casteos manuales
export type Game    = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
