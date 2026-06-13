import { z } from "zod";

export const uploadSchema = z.object({
    department_id: z.string().min(1, "Department is required"),
    course_id: z.string().min(1, "Course is required"),
    exam_name_id: z.string().min(1, "Exam Name is required"),
    exam_year: z.coerce
        .number()
        .int()
        .min(2000, "Year must be 2000 or later")
        .max(new Date().getFullYear() + 1, "Invalid year"),
    session: z.enum(["Spring", "Summer", "Fall", "Winter"]).nullable().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export type UploadFormData = z.infer<typeof uploadSchema>;

export interface BulkUploadItem {
    id: string;
    file: File;
    previewUrl: string;
    name: string;
    error?: string;
}

export const bulkUploadSchema = z.object({
    department_id: z.string().min(1, "Department is required"),
    course_id: z.string().min(1, "Course is required"),
    exam_name_id: z.string().min(1, "Exam Name is required"),
    exam_year: z.coerce
        .number()
        .int()
        .min(2000, "Year must be 2000 or later")
        .max(new Date().getFullYear() + 1, "Invalid year"),
    session: z.enum(["Spring", "Summer", "Fall", "Winter"]).nullable().optional(),
    subject: z.string().optional(),
});

export type BulkUploadFormData = z.infer<typeof bulkUploadSchema>;

export interface BulkUploadResult {
    success: boolean;
    uploaded?: number;
    failed?: number;
    errors?: Array<{ name: string; error: string }>;
    error?: string;
}
