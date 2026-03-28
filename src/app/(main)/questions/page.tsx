import { Suspense } from "react";
import { getTaxonomyItems } from "@/lib/actions/taxonomy";
import { getQuestions } from "@/lib/actions/questions";
import { QuestionFilters } from "@/components/features/questions/QuestionFilters";
import { QuestionList } from "@/components/features/questions/QuestionList";
import { QuestionCardSkeleton } from "@/components/features/questions/QuestionCardSkeleton";
import { SearchX } from "lucide-react";
import { QuestionRedirect } from "@/components/features/questions/QuestionRedirect";

export default async function QuestionsPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const searchParams = await props.searchParams;

    // If ?id= is present, redirect to the detail page
    if (searchParams.id) {
        return <QuestionRedirect id={searchParams.id} />;
    }

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
                    <Suspense fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <QuestionCardSkeleton key={i} />
                            ))}
                        </div>
                    }>
                        {!questions || questions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
                                <div className="bg-muted/50 p-6 rounded-full mb-6 animate-pulse">
                                    <SearchX className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Matching Questions Found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                                    We couldn&apos;t find any questions matching your current filters. Try resetting the filters or searching for a different keyword.
                                </p>
                            </div>
                        ) : (
                            <QuestionList questions={questions} />
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
