"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { UploadFormData, BulkUploadFormData, BulkUploadResult } from "@/lib/validations/upload";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_BULK_FILES = 10;
const MAX_BULK_SIZE = 50 * 1024 * 1024; // 50MB total for bulk

/**
 * Upload multiple question images in a single batch.
 */
export async function uploadBulkQuestions(
    files: Array<{ name: string; blob: Blob; type: string }>,
    metadata: BulkUploadFormData
): Promise<BulkUploadResult> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: "Unauthorized" };
    }

    if (files.length === 0) {
        return { success: false, error: "No files provided" };
    }

    if (files.length > MAX_BULK_FILES) {
        return { success: false, error: `Maximum ${MAX_BULK_FILES} files allowed per batch` };
    }

    const totalSize = files.reduce((acc, f) => acc + f.blob.size, 0);
    if (totalSize > MAX_BULK_SIZE) {
        return { success: false, error: "Total file size exceeds 50MB limit" };
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user.id)
        .gte("created_at", oneHourAgo);

    const maxAllowed = 5;
    if (count !== null && count + files.length > maxAllowed) {
        return { 
            success: false, 
            error: `Rate limit exceeded. You can upload ${maxAllowed - (count || 0)} more question(s) this hour.` 
        };
    }

    let storageClient;
    try {
        storageClient = createAdminClient();
    } catch (e) {
        console.warn("Falling back to standard client for storage.");
        storageClient = supabase;
    }

    const uploaded: string[] = [];
    const failed: Array<{ name: string; error: string }> = [];

    for (const file of files) {
        const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
        const ext = file.type.split("/").pop()?.toLowerCase();
        
        if (!ext || !allowedExts.includes(ext)) {
            failed.push({ name: file.name, error: "Invalid file type" });
            continue;
        }

        if (file.blob.size > MAX_FILE_SIZE) {
            failed.push({ name: file.name, error: "File too large (max 10MB)" });
            continue;
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            failed.push({ name: file.name, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF allowed." });
            continue;
        }

        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

        const { error: storageError } = await storageClient.storage
            .from("questions")
            .upload(fileName, file.blob, {
                contentType: file.type,
                upsert: false,
            });

        if (storageError) {
            failed.push({ name: file.name, error: storageError.message });
            continue;
        }

        const { data: { publicUrl } } = storageClient.storage
            .from("questions")
            .getPublicUrl(fileName);

        const descriptionText = file.name.trim() 
            ? `[${metadata.subject || 'Question'}] ${file.name.trim()}`
            : (metadata.subject ? `[${metadata.subject}]` : null);
            
        const { error: dbError } = await supabase.from("questions").insert({
            department_id: metadata.department_id,
            course_id: metadata.course_id,
            exam_name_id: metadata.exam_name_id,
            exam_year: metadata.exam_year,
            session: metadata.session || undefined,
            description: descriptionText || undefined,
            tags: [],
            image_url: publicUrl,
            created_by: user.id,
            status: "pending",
        });

        if (dbError) {
            await storageClient.storage.from("questions").remove([fileName]);
            failed.push({ name: file.name, error: dbError.message });
            continue;
        }

        uploaded.push(file.name);
    }

    revalidatePath("/questions");

    if (failed.length > 0 && uploaded.length === 0) {
        return { success: false, uploaded: 0, failed: failed.length, errors: failed };
    }

    return {
        success: true,
        uploaded: uploaded.length,
        failed: failed.length,
        errors: failed.length > 0 ? failed : undefined,
    };
}

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

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { success: false, error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { success: false, error: "File too large. Maximum size is 10MB." };
    }

    // Use admin client if available, otherwise fallback to standard client
    let storageClient;
    try {
        storageClient = createAdminClient();
    } catch (e) {
        console.warn("Falling back to standard client for storage. Ensure RLS SQL scripts are run.");
        storageClient = supabase;
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!fileExt || !allowedExts.includes(fileExt)) {
        return { success: false, error: "Invalid file extension." };
    }
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

    const { error: storageError } = await storageClient.storage
        .from("questions")
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
        });

    if (storageError) {
        console.error("Storage upload error:", storageError);
        if (storageError.message.includes("row-level security")) {
            return { success: false, error: "Storage permission denied. Please run the provided SQL script in Supabase or add your SUPABASE_SERVICE_ROLE_KEY to .env." };
        }
        return { success: false, error: `Storage error: ${storageError.message}` };
    }

    // Get public URL
    const { data: { publicUrl } } = storageClient.storage
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
        await storageClient.storage.from("questions").remove([fileName]);
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
