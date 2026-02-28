"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Unauthorized" };
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
        .eq("id", user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true };
}
