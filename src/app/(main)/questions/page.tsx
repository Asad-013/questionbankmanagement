import { Suspense } from "react";
import { getTaxonomyItems } from "@/lib/actions/taxonomy";
import { getQuestions } from "@/lib/actions/questions";
import { QuestionFilters } from "@/components/features/questions/QuestionFilters";
import { QuestionList } from "@/components/features/questions/QuestionList";
import { Loader2, SearchX } from "lucide-react";

export default async function QuestionsPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const searchParams = await props.searchParams;

    // Simulate slight delay for skeleton test if needed, but for now direct
    const [departments, examNames, academicYears, questions] = await Promise.all([
        getTaxonomyItems("departments"),
        getTaxonomyItems("exam_names"),
        getTaxonomyItems("academic_years"),
        getQuestions({
            department_id: searchParams.department_id,
            course_id: searchParams.course_id,
            exam_name_id: searchParams.exam_name_id,
            search: searchParams.search,
            year: searchParams.year,
        }),
    ]);

    return (
        <div className="container px-4 md:px-6 py-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3">Explore Repository</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                    Access hundreds of past exam papers curated by department and session.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0">
                    <Suspense fallback={<div className="h-64 bg-muted rounded-xl animate-pulse" />}>
                        <QuestionFilters
                            departments={departments || []}
                            examNames={examNames || []}
                            academicYears={academicYears || []}
                        />
                    </Suspense>
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-h-[500px]">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" />
                            Showing {questions?.length || 0} Results
                        </h2>
                        {/* Optional Sort Dropdown could go here */}
                    </div>

                    {!questions || questions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
                            <div className="bg-muted/50 p-6 rounded-full mb-6 animate-pulse">
                                <SearchX className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No Matching Questions Filtered</h3>
                            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                                We couldn't find any questions matching your current filters. Try resetting the filters or searching for a different keyword.
                            </p>
                        </div>
                    ) : (
                        <QuestionList questions={questions} />
                    )}
                </div>
            </div>
        </div>
    );
}
