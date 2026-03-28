"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type TaxonomyType = "exam_names" | "courses" | "departments" | "academic_years";

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        throw new Error("Unauthorized: Admins only");
    }

    return { supabase, user };
}

export async function createTaxonomyItem(
    type: TaxonomyType,
    data: Record<string, any>
) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from(type).insert(data);

    if (error) {
        console.error(`Error creating ${type}:`, error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/settings/taxonomy");
    return { success: true };
}

export async function updateTaxonomyItem(
    type: TaxonomyType,
    id: string,
    data: Record<string, any>
) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from(type).update(data).eq("id", id);

    if (error) {
        console.error(`Error updating ${type}:`, error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/settings/taxonomy");
    return { success: true };
}

export async function deleteTaxonomyItem(type: TaxonomyType, id: string) {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from(type).delete().eq("id", id);

    if (error) {
        console.error(`Error deleting ${type}:`, error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/settings/taxonomy");
    return { success: true };
}

export async function getTaxonomyItems(type: TaxonomyType) {
    const supabase = await createClient();
    const { data, error } = await supabase.from(type).select("*").order("created_at", { ascending: false });

    if (error) {
        console.error(`Error fetching ${type}:`, error);
        return [];
    }

    return data;
}

export async function getCoursesByDepartment(departmentId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("department_id", departmentId)
        .order("code", { ascending: true });

    if (error) {
        console.error("Error fetching courses:", error);
        return [];
    }

    return data;
}
