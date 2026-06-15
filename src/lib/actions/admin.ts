"use server";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

async function requireAuth() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from("users")
        .select("id, role")
        .eq("clerk_id", userId)
        .single();

    if (!profile) throw new Error("Unauthorized");
    return { supabase, userId, profile };
}

async function requireAdmin() {
    const ctx = await requireAuth();
    if (ctx.profile.role !== "admin") throw new Error("Unauthorized: Admins only");
    return ctx;
}

async function requireAdminOrModerator() {
    const ctx = await requireAuth();
    if (ctx.profile.role !== "admin" && ctx.profile.role !== "moderator") {
        throw new Error("Unauthorized: Admins or moderators only");
    }
    return ctx;
}

// ---------------------------------------------------------------------------
// Dashboard stats
// ---------------------------------------------------------------------------

/**
 * Fetch dashboard statistics
 */
export async function getAdminStats() {
    await requireAdminOrModerator();
    const supabase = createAdminClient();

    const [
        { count: usersCount },
        { count: questionsCount },
        { count: pendingCount },
        { count: departmentsCount },
        { data: recentQuestions },
    ] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("departments").select("*", { count: "exact", head: true }),
        supabase.from("questions").select("*, departments(name)").order("created_at", { ascending: false }).limit(5),
    ]);

    return {
        totalUsers: usersCount || 0,
        totalQuestions: questionsCount || 0,
        pendingQuestions: pendingCount || 0,
        totalDepartments: departmentsCount || 0,
        recentActivity: (recentQuestions || []).map((q) => ({
            id: q.id,
            type: "question",
            title: `New question: ${q.exam_year}`,
            description: `A question for ${q.departments?.name || "unknown department"} was uploaded.`,
            time: q.created_at,
        })),
    };
}

// ---------------------------------------------------------------------------
// User management
// ---------------------------------------------------------------------------

/**
 * Fetch all users
 */
export async function getAllUsers() {
    await requireAdmin();
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, newRole: "admin" | "student" | "moderator") {
    const { profile: currentUserProfile } = await requireAdmin();

    const supabase = createAdminClient();

    if (userId === currentUserProfile.id) {
        return { success: false, error: "You cannot change your own role." };
    }

    const { data: targetProfile } = await supabase.from("users").select("role").eq("id", userId).single();

    const { error } = await supabase
        .from("users")
        .update({ role: newRole })
        .eq("id", userId);

    if (error) return { success: false, error: error.message };

    // Audit Log
    await supabase.from("audit_logs").insert({
        action: "UPDATE_ROLE",
        entity_type: "user",
        entity_id: userId,
        performed_by: currentUserProfile.id,
        details: { oldRole: targetProfile?.role, newRole },
    });

    revalidatePath("/", "layout");
    return { success: true };
}

/**
 * Add / Promote user to moderator by Email
 */
export async function addModeratorByEmail(email: string) {
    const { profile: currentUserProfile } = await requireAdmin();
    const supabase = createAdminClient();

    if (!email || !email.trim()) return { success: false, error: "Email is required" };

    const { data: targetUser, error: findError } = await supabase
        .from("users")
        .select("id, role")
        .eq("email", email.trim().toLowerCase())
        .single();

    if (findError || !targetUser) {
        return { success: false, error: "User not found. They must register an account first." };
    }

    if (targetUser.role === "admin" || targetUser.role === "moderator") {
        return { success: false, error: `User is already a ${targetUser.role}.` };
    }

    const { error: updateError } = await supabase
        .from("users")
        .update({ role: "moderator" })
        .eq("id", targetUser.id);

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath("/", "layout");
    return { success: true };
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

/**
 * Fetch all content (for inventory)
 */
export async function getAllContent() {
    await requireAdminOrModerator();
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("questions")
        .select(`
          *,
          departments(name),
          exam_names(name),
          courses(code),
          uploader:users!created_by(email)
      `)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

/**
 * Delete a question (Soft delete)
 */
export async function deleteQuestion(id: string) {
    const { profile } = await requireAdmin();
    const supabase = createAdminClient();

    const { data: question, error: fetchError } = await supabase
        .from("questions")
        .select("image_url")
        .eq("id", id)
        .single();

    if (fetchError || !question) {
        return { success: false, error: "Question not found" };
    }

    const { error: dbError } = await supabase
        .from("questions")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

    if (dbError) return { success: false, error: dbError.message };

    await supabase.from("audit_logs").insert({
        action: "DELETE_QUESTION",
        entity_type: "question",
        entity_id: id,
        performed_by: profile.id,
        details: { soft_deleted: true },
    });

    revalidatePath("/admin/content");
    revalidatePath("/questions");
    return { success: true };
}

/**
 * Fetch all feedback submissions
 */
export async function getAllFeedback() {
    await requireAdminOrModerator();
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}
