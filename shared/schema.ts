import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const memos = pgTable("memos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  styles: jsonb("styles").notNull().$type<{
    color: string;
    fontSize: string;
    fontWeight: string;
    fontStyle: string;
  }>(),
  bgColor: varchar("bg_color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemoSchema = createInsertSchema(memos).omit({
  id: true,
  createdAt: true,
});

export type InsertMemo = z.infer<typeof insertMemoSchema>;
export type Memo = typeof memos.$inferSelect;
