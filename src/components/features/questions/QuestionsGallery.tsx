"use client";

import Link from "next/link";
import Image from "next/image";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Question {
    id: string;
    image_url: string | null;
    exam_year: string;
    exam_names?: { name: string };
    departments?: { name: string };
    courses?: { title: string; code: string };
    session?: string;
    description?: string;
}

interface QuestionsGalleryProps {
    questions: Question[];
}

export function QuestionsGallery({ questions }: QuestionsGalleryProps) {
    if (!questions || questions.length === 0) return null;

    const featuredQuestion = questions[0];
    const gridQuestions = questions.slice(1, 7);
    const moreQuestions = questions.slice(7, 13);

    return (
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Live Preview</span>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
                        See What&apos;s Inside
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                        Get a glimpse of the exam papers available in our archive. Click to view full details.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    <Link href={`/questions/${featuredQuestion.id}`} className="group relative">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                            {featuredQuestion.image_url ? (
                                <Image
                                    src={featuredQuestion.image_url}
                                    alt={featuredQuestion.courses?.title || "Question paper"}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                    <BookOpen className="h-20 w-20 text-primary/50" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                            
                            <div className="absolute top-4 left-4 flex gap-2">
                                <Badge className="bg-white/90 text-black backdrop-blur-sm font-semibold">
                                    {featuredQuestion.exam_names?.name}
                                </Badge>
                                <Badge className="bg-black/70 text-white backdrop-blur-sm">
                                    {featuredQuestion.exam_year}
                                </Badge>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                                    <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-xs">
                                        {featuredQuestion.courses?.code}
                                    </span>
                                    <span>•</span>
                                    <span>{featuredQuestion.departments?.name}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">
                                    {featuredQuestion.courses?.title}
                                </h3>
                                <div className="flex items-center gap-2 text-white/80 text-sm">
                                    <Eye className="h-4 w-4" />
                                    <span>Click to view</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {gridQuestions.map((question) => (
                            <Link
                                key={question.id}
                                href={`/questions/${question.id}`}
                                className="group relative aspect-square rounded-xl overflow-hidden shadow-lg"
                            >
                                {question.image_url ? (
                                    <Image
                                        src={question.image_url}
                                        alt={question.courses?.title || "Question paper"}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                        <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white text-xs font-medium truncate">
                                        {question.courses?.code}
                                    </p>
                                    <p className="text-white/70 text-[10px]">
                                        {question.exam_year}
                                    </p>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="h-3 w-3 text-white" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {moreQuestions.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {moreQuestions.map((question) => (
                            <Link
                                key={question.id}
                                href={`/questions/${question.id}`}
                                className="group flex-shrink-0 w-40 relative aspect-[3/4] rounded-xl overflow-hidden shadow-md"
                            >
                                {question.image_url ? (
                                    <Image
                                        src={question.image_url}
                                        alt={question.courses?.title || "Question paper"}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                        <BookOpen className="h-6 w-6 text-muted-foreground/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white text-xs font-mono font-bold">
                                        {question.courses?.code}
                                    </p>
                                    <p className="text-white/70 text-[10px] truncate">
                                        {question.departments?.name}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/questions">
                        <Button size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90">
                            Browse All Papers <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="outline" size="lg" className="rounded-full">
                            Sign Up to Download <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
