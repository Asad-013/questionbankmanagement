"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return { supabase, user };
}

async function requireAdmin() {
    const { supabase, user } = await requireAuth();
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") throw new Error("Unauthorized: Admins only");
    return { supabase, user };
}

async function requireAdminOrModerator() {
    const { supabase, user } = await requireAuth();
    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin" && profile?.role !== "moderator") {
        throw new Error("Unauthorized: Admins or moderators only");
    }
    return { supabase, user };
}

/**
 * Fetch dashboard statistics
 */
export async function getAdminStats() {
    await requireAdminOrModerator();
    const supabase = await createClient();

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
        recentActivity: (recentQuestions || []).map(q => ({
            id: q.id,
            type: "question",
            title: `New question: ${q.exam_year}`,
            description: `A question for ${q.departments?.name || "unknown department"} was uploaded.`,
            time: q.created_at,
        })),
    };
}

/**
 * Fetch all users
 */
export async function getAllUsers() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") throw new Error("Unauthorized: Admins only");

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
    const supabase = await createClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { success: false, error: "Unauthorized: Admins only" };

    if (userId === user.id) {
        return { success: false, error: "You cannot change your own role." };
    }

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
        performed_by: user.id,
        details: { oldRole: profile.role, newRole }
    });

    revalidatePath("/", "layout");
    return { success: true };
}

/**
 * Add / Promote user to moderator by Email
 */
export async function addModeratorByEmail(email: string) {
    const supabase = await createClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { success: false, error: "Unauthorized: Admins only" };

    if (!email || !email.trim()) return { success: false, error: "Email is required" };

    // Find user by email
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

    // Update role
    const { error: updateError } = await supabase
        .from("users")
        .update({ role: "moderator" })
        .eq("id", targetUser.id);

    if (updateError) return { success: false, error: updateError.message };

    revalidatePath("/", "layout");
    return { success: true };
}

/**
 * Fetch all content (for inventory)
 */
export async function getAllContent() {
    await requireAdminOrModerator();
    const supabase = await createClient();
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
 * Delete a question (Hard delete)
 */
export async function deleteQuestion(id: string) {
    const supabase = await createClient();

    // Verify admin only can delete
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") return { success: false, error: "Unauthorized: Only Admins can delete questions" };

    // Get question first to find image path
    const { data: question, error: fetchError } = await supabase
        .from("questions")
        .select("image_url")
        .eq("id", id)
        .single();

    if (fetchError || !question) {
        return { success: false, error: "Question not found" };
    }

    // Update DB (Soft Delete)
    const { error: dbError } = await supabase
        .from("questions")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

    if (dbError) return { success: false, error: dbError.message };

    // Log the Audit
    await supabase.from("audit_logs").insert({
        action: "DELETE_QUESTION",
        entity_type: "question",
        entity_id: id,
        performed_by: user.id,
        details: { soft_deleted: true }
    });

    revalidatePath("/admin/content");
    revalidatePath("/questions");
    return { success: true };
}
