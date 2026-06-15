"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, error: "Unauthorized" };
    }

    const supabase = createAdminClient();

    // Resolve the Supabase user ID by clerk_id
    const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

    if (!profile) {
        return { success: false, error: "User profile not found" };
    }

    const fullName = formData.get("full_name") as string;
    const phoneNumber = formData.get("phone_number") as string;
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatar_url") as string;

    const { error } = await supabase
        .from("users")
        .update({
            full_name: fullName || null,
            phone_number: phoneNumber || null,
            bio: bio || null,
            avatar_url: avatarUrl || null,
        })
        .eq("id", profile.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true };
}
