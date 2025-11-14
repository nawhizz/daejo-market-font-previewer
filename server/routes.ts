import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemoSchema } from "@shared/schema";
import sanitizeHtml from "sanitize-html";

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/memos - Create a new memo
  app.post("/api/memos", async (req, res) => {
    try {
      // Validate request body
      const validationResult = insertMemoSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid request data",
          details: validationResult.error.errors,
        });
      }

      const { content, styles, bgColor } = validationResult.data;

      // Sanitize content to prevent XSS attacks
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: [], // No HTML tags allowed, plain text only
        allowedAttributes: {},
      });

      // Validate color values (simple hex color validation)
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!hexColorRegex.test(styles.color) || !hexColorRegex.test(bgColor)) {
        return res.status(400).json({
          error: "Invalid color format. Use hex colors (e.g., #FFFFFF)",
        });
      }

      // Validate font size (must be between 16 and 72)
      const fontSizeNum = parseInt(styles.fontSize);
      if (isNaN(fontSizeNum) || fontSizeNum < 16 || fontSizeNum > 72) {
        return res.status(400).json({
          error: "Font size must be between 16 and 72 pixels",
        });
      }

      // Validate font weight
      if (!["normal", "bold"].includes(styles.fontWeight)) {
        return res.status(400).json({
          error: "Font weight must be 'normal' or 'bold'",
        });
      }

      // Validate font style
      if (!["normal", "italic"].includes(styles.fontStyle)) {
        return res.status(400).json({
          error: "Font style must be 'normal' or 'italic'",
        });
      }

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
