import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemoSchema } from "@shared/schema";
import sanitizeHtml from "sanitize-html";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/memos - Get all memos
  app.get("/api/memos", async (_req, res) => {
    try {
      const memos = await storage.getMemos(20);
      res.json(memos);
    } catch (error) {
      console.error("Error fetching memos:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  // POST /api/memos - Create a new memo
  app.post("/api/memos", async (req, res) => {
    try {
      // Validate request body with strict schema validation
      const validationResult = insertMemoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: validationResult.error.errors,
        });
      }

      const { content, styles, bgColor } = validationResult.data;

      // Sanitize content to prevent XSS attacks (strip all HTML tags)
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: [], // No HTML tags allowed, plain text only
        allowedAttributes: {},
      });

      // All other validations (colors, fontSize, fontWeight, fontStyle) 
      // are now handled by the Zod schema with strict regex/enum checks

      // Create memo with sanitized content
      const memo = await storage.createMemo({
        content: sanitizedContent,
        styles,
        bgColor,
      });

      res.status(201).json({
        id: memo.id,
        createdAt: memo.createdAt,
        message: "Memo saved successfully.",
      });
    } catch (error) {
      console.error("Error creating memo:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
