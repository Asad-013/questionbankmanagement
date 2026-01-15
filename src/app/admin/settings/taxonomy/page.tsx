import { TaxonomyManager } from "@/components/features/admin/TaxonomyManager";

export default function TaxonomyPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Academic Setup</h1>
                <p className="text-muted-foreground mt-2">
                    Configure the Departments, Exam Types, and Courses for the ILET Archive.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                <TaxonomyManager
                    type="departments"
                    title="Departments"
                    description="Manage university departments (e.g., Computer Science, Electrical Engineering)."
                    fields={[
                        { name: "name", label: "Department Name", type: "text" },
                        { name: "code", label: "Code (e.g. CSE)", type: "text" },
                        { name: "active", label: "Active", type: "boolean" },
                    ]}
                />

                <TaxonomyManager
                    type="exam_names"
                    title="Exam Names"
                    description="Standardized exam names (e.g., Midterm Spring 2026, Final Fall 2025)."
                    fields={[
                        { name: "name", label: "Exam Name", type: "text" },
                        { name: "is_active", label: "Active", type: "boolean" },
                    ]}
                />

                <TaxonomyManager
                    type="courses"
                    title="Courses"
                    description="Courses available within departments."
                    fields={[
                        { name: "code", label: "Course Code", type: "text" },
                        { name: "title", label: "Course Title", type: "text" },
                        {
                            name: "department_id",
                            label: "Department",
                            type: "select",
                            source: "departments"
                        },
                        { name: "is_active", label: "Active", type: "boolean" },
                    ]}
                />
            </div>
        </div>
    );
}
