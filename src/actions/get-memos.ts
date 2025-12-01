"use server";

import { supabase } from "@/lib/supabase/client";

export async function getMemos() {
    try {
        const { data, error } = await supabase
            .from('memos')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error("Error fetching memos:", error);
            throw new Error("Failed to fetch memos");
        }

        // Transform to match expected format (camelCase)
        return data.map(memo => ({
            id: memo.id,
            content: memo.content,
            styles: memo.styles,
            bgColor: memo.bg_color,
            authorName: memo.author_name,
            createdAt: memo.created_at
        }));
    } catch (error) {
        console.error("Error fetching memos:", error);
        throw new Error("Failed to fetch memos");
    }
}
