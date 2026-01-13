import { z } from "zod";

export const uploadSchema = z.object({
    department_id: z.string().min(1, "Department is required"),
    course_id: z.string().min(1, "Course is required"), // Maps to courses table ID
    exam_name_id: z.string().min(1, "Exam Name is required"),
    exam_year: z.coerce
        .number()
        .int()
        .min(2000, "Year must be 2000 or later")
        .max(new Date().getFullYear() + 1, "Invalid year"),
    session: z.enum(["Spring", "Summer", "Fall", "Winter"]).nullable().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Images handled separately in state, but validated for presence
});

export type UploadFormData = z.infer<typeof uploadSchema>;
