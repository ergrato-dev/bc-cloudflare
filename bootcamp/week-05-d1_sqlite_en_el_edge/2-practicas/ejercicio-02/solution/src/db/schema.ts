import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

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

export type Game    = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
