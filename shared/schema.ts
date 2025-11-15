import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Strict validation for memo styles to prevent XSS
export const memoStylesSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format"),
  fontSize: z.string().regex(/^(1[6-9]|[2-6][0-9]|7[0-2])px$/, "Font size must be between 16px and 72px"),
  fontWeight: z.enum(["normal", "bold"]),
  fontStyle: z.enum(["normal", "italic"]),
}).strict();

export const memos = pgTable("memos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  styles: jsonb("styles").notNull().$type<z.infer<typeof memoStylesSchema>>(),
  bgColor: varchar("bg_color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemoSchema = createInsertSchema(memos).omit({
  id: true,
  createdAt: true,
}).extend({
  styles: memoStylesSchema,
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format"),
});

export type InsertMemo = z.infer<typeof insertMemoSchema>;
export type Memo = typeof memos.$inferSelect;
