"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UploadFormData } from "@/lib/validations/upload";

export async function createQuestion(data: UploadFormData, imagePath: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("questions").insert({
        department_id: data.department_id,
        course_id: data.course_id,
        exam_name_id: data.exam_name_id,
        exam_year: data.exam_year,
        session: data.session,
        description: data.description,
        tags: data.tags,
        image_url: imagePath,
        created_by: user.id,
        status: "pending"
    });

    if (error) {
        console.error("Error creating question:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/questions");
    return { success: true };
}

export async function getQuestions(filters: {
    department_id?: string;
    course_id?: string;
    exam_name_id?: string;
    search?: string;
    year?: string;
} = {}) {
    const supabase = await createClient();
    let query = supabase
        .from("questions")
        .select(`
      *,
      departments(name),
      courses(code, title),
      exam_names(name)
    `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

    if (filters.department_id) {
        query = query.eq("department_id", filters.department_id);
    }
    if (filters.course_id) {
        query = query.eq("course_id", filters.course_id);
    }
    if (filters.exam_name_id) {
        query = query.eq("exam_name_id", filters.exam_name_id);
    }
    if (filters.year) {
        query = query.eq("exam_year", parseInt(filters.year));
    }
    if (filters.search) {
        query = query.ilike("description", `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching questions:", error);
        return [];
    }

    return data;
}
