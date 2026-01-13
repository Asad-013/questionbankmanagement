"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPendingQuestions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("questions")
        .select(`
        *,
        departments(name),
        courses(code, title),
        exam_names(name),
        created_by_user:users!questions_created_by_fkey(email)
    `)
        .eq("status", "pending")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching pending questions:", error);
        return [];
    }

    return data;
}

export async function approveQuestion(id: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("questions")
        .update({
            status: "approved",
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/moderation");
    revalidatePath("/questions"); // Update public list
    return { success: true };
}

export async function rejectQuestion(id: string, reason: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("questions")
        .update({
            status: "rejected",
            rejection_reason: reason,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString()
        })
        .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/moderation");
    return { success: true };
}
