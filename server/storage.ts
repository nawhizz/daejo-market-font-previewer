import { type Memo, type InsertMemo } from "@shared/schema";
import { db } from "../db";
import { memos } from "@shared/schema";

export interface IStorage {
  createMemo(memo: InsertMemo): Promise<Memo>;
  getMemos(limit?: number): Promise<Memo[]>;
}

export class DbStorage implements IStorage {
  async createMemo(insertMemo: InsertMemo): Promise<Memo> {
    const [memo] = await db.insert(memos).values(insertMemo).returning();
    return memo;
  }

  async getMemos(limit: number = 10): Promise<Memo[]> {
    const { desc } = await import("drizzle-orm");
    return await db
      .select()
      .from(memos)
      .orderBy(desc(memos.createdAt))
      .limit(limit);
  }
}

export const storage = new DbStorage();
