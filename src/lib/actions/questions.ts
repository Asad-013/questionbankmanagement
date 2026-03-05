"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { UploadFormData } from "@/lib/validations/upload";

/**
 * Upload a question image to storage (server-side, bypasses storage RLS)
 * and insert the question record.
 */
export async function uploadQuestion(formData: FormData) {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: "Unauthorized" };
    }

    // Rate Limiting: Max 5 uploads per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id)
        .gte("created_at", oneHourAgo);

    if (count !== null && count >= 5) {
        return { success: false, error: "Rate limit exceeded: You can only upload 5 questions per hour. Please try again later." };
    }

    // Extract fields from FormData
    const file = formData.get("file") as File | null;
    const department_id = formData.get("department_id") as string;
    const course_id = formData.get("course_id") as string;
    const exam_name_id = formData.get("exam_name_id") as string;
    const exam_year = parseInt(formData.get("exam_year") as string, 10);
    const session = (formData.get("session") as string) || null;
    const description = (formData.get("description") as string) || null;

    if (!file || file.size === 0) {
        return { success: false, error: "No image file provided" };
    }

    // Use admin client to upload file (bypasses storage RLS)
    const adminClient = createAdminClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

    const { error: storageError } = await adminClient.storage
        .from("questions")
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
        });

    if (storageError) {
        console.error("Storage upload error:", storageError);
        return { success: false, error: `Storage error: ${storageError.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
        .from("questions")
        .getPublicUrl(fileName);

    // Insert question record using the user's session client (respects RLS correctly)
    const { error: dbError } = await supabase.from("questions").insert({
        department_id,
        course_id,
        exam_name_id,
        exam_year,
        session: session || undefined,
        description: description || undefined,
        tags: [],
        image_url: publicUrl,
        created_by: user.id,
        status: "pending",
    });

    if (dbError) {
        console.error("DB insert error:", dbError);
        // Clean up the uploaded file if DB insert fails
        await adminClient.storage.from("questions").remove([fileName]);
        return { success: false, error: dbError.message };
    }

    revalidatePath("/questions");
    return { success: true };
}

export async function createQuestion(data: UploadFormData, imagePath: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // Rate Limiting: Max 5 uploads per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
        .from("questions")
        .select("*", { count: 'exact', head: true })
        .eq("created_by", user.id)
        .gte("created_at", oneHourAgo);

    if (count !== null && count >= 5) {
        return { success: false, error: "Rate limit exceeded: You can only upload 5 questions per hour. Please try again later." };
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
