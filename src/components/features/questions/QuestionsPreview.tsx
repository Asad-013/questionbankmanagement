import Link from "next/link";
import { getQuestions } from "@/lib/actions/questions";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search } from "lucide-react";

export async function QuestionsPreview() {
    const questions = await getQuestions();

    if (!questions || questions.length === 0) {
        return (
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Questions Coming Soon</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                        The archive is being built. Be the first to contribute by uploading past exam papers.
                    </p>
                    <Link href="/questions">
                        <Button size="lg" className="rounded-full">
                            Explore When Ready <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        );
    }

    const previewQuestions = questions.slice(0, 6);

    return (
        <section className="py-16 md:py-24 bg-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Browse Archive</span>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
                            Recent Questions
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-xl">
                            Browse the latest uploaded exam papers. Search by department, course code, or year.
                        </p>
                    </div>
                    <Link href="/questions">
                        <Button variant="outline" size="lg" className="rounded-full group">
                            View All Questions
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {previewQuestions.map((question) => (
                        <QuestionCard key={question.id} question={question} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/questions">
                        <Button size="lg" className="rounded-full shadow-lg">
                            Search More Questions <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
