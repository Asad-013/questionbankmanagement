import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { QuestionDetail } from "@/components/features/questions/QuestionDetail";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: question } = await supabase
        .from("questions")
        .select(`
            *,
            departments(name),
            courses(code, title),
            exam_names(name)
        `)
        .eq("id", id)
        .eq("status", "approved")
        .single();

    if (!question) {
        return { title: "Question Not Found - ILET" };
    }

    const title = `${question.courses?.code || ""} ${question.courses?.title || "Question"} (${question.exam_year}) - ILET`;
    const description = `${question.exam_names?.name || "Exam"} paper for ${question.courses?.title || "course"} from ${question.exam_year}. Department: ${question.departments?.name || "ILET"}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: question.image_url ? [{ url: question.image_url, width: 1200, height: 630 }] : [],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: question.image_url ? [question.image_url] : [],
        },
    };
}

export default async function QuestionDetailPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: question } = await supabase
        .from("questions")
        .select(`
            *,
            departments(name),
            courses(code, title, department_id),
            exam_names(name)
        `)
        .eq("id", id)
        .eq("status", "approved")
        .single();

    if (!question) {
        notFound();
    }

    const { data: relatedQuestions } = await supabase
        .from("questions")
        .select(`
            *,
            departments(name),
            courses(code, title),
            exam_names(name)
        `)
        .eq("status", "approved")
        .neq("id", id)
        .or(`course_id.eq.${question.course_id},department_id.eq.${question.department_id}`)
        .order("created_at", { ascending: false })
        .limit(4);

    return (
        <QuestionDetail
            question={question}
            relatedQuestions={relatedQuestions || []}
        />
    );
}
