"use server";

import { supabase } from "@/lib/supabase/client";
import { insertMemoSchema } from "@/lib/db/schema";
import sanitizeHtml from "sanitize-html";

export async function saveMemo(formData: FormData) {
    try {
        const rawData = {
            content: formData.get("content"),
            styles: JSON.parse(formData.get("styles") as string),
            bgColor: formData.get("bgColor"),
            authorName: formData.get("authorName") as string || "",
        };

        // Validate with Zod
        const validatedData = insertMemoSchema.parse(rawData);

        // Sanitize content
        const sanitizedContent = sanitizeHtml(validatedData.content, {
            allowedTags: [],
            allowedAttributes: {},
        });

        // Insert into Supabase
        const { data, error } = await supabase
            .from('memos')
            .insert([{
                content: sanitizedContent,
                styles: validatedData.styles,
                bg_color: validatedData.bgColor,
                author_name: validatedData.authorName || null,
            }])
            .select();

        if (error) {
            console.error("Error saving memo:", error);
            throw new Error("Failed to save memo");
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Error saving memo:", error);

        if (error.errors) {
            return {
                success: false,
                error: "Invalid memo data: " + error.errors.map((e: any) => e.message).join(", ")
            };
        }

        return { success: false, error: error.message || "Failed to save memo" };
    }
}
