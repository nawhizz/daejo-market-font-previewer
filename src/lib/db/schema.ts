import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

// Strict validation for memo styles to prevent XSS
export const memoStylesSchema = z.object({
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format"),
    fontSize: z.string().regex(/^(1[6-9]|[2-6][0-9]|7[0-2])px$/, "Font size must be between 16px and 72px"),
    fontWeight: z.enum(["normal", "bold"]),
    fontStyle: z.enum(["normal", "italic"]),
    lineHeight: z.number().min(0.8).max(2.0),
    letterSpacing: z.string().regex(/^-?[0-9]*\.?[0-9]+em$/, "Letter spacing must be in em units"),
}).strict();

export const memos = pgTable("memos", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    content: text("content").notNull(),
    styles: jsonb("styles").notNull().$type<z.infer<typeof memoStylesSchema>>(),
    bgColor: varchar("bg_color").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemoSchema = z.object({
    content: z.string(),
    styles: memoStylesSchema,
    bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format"),
    authorName: z.string().max(100).optional(),
});

export type InsertMemo = z.infer<typeof insertMemoSchema>;
export type Memo = typeof memos.$inferSelect;
