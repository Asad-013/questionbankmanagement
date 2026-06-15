"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns the Clerk userId and the corresponding Supabase user profile.
 * Throws if the user is not authenticated or not found in public.users.
 */
export async function getAuthenticatedUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createAdminClient();
    const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

    if (error || !profile) {
        throw new Error("User profile not found. Please try signing out and back in.");
    }

    return { userId, profile, supabase };
}

/**
 * Server-side logout — not needed with Clerk (handled client-side),
 * but kept for any server-action call sites.
 */
export async function logout() {
    // Clerk sign-out is handled client-side via useClerk().signOut()
    // This is a no-op placeholder for backwards compatibility.
}
