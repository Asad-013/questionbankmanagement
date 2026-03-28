import { createClient } from "@/lib/supabase/server";

export async function getRelatedQuestions(
    questionId: string,
    courseId: string | undefined,
    departmentId: string | undefined,
    limit = 4
) {
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
        .neq("id", questionId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (courseId) {
        query = query.eq("course_id", courseId);
    } else if (departmentId) {
        query = query.eq("department_id", departmentId);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching related questions:", error);
        return [];
    }

    return data;
}
