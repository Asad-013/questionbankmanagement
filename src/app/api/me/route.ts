import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/me
 * Returns the current user's Supabase profile based on their Clerk userId.
 * Used by client components (Navbar) that need role/avatar/name data.
 */
export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json(null);

    const supabase = createAdminClient();
    const { data } = await supabase
        .from("users")
        .select("id, role, full_name, email, avatar_url")
        .eq("clerk_id", userId)
        .single();

    return NextResponse.json(data ?? null);
}
