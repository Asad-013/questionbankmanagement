"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface RelatedQuestionsProps {
    questions: any[];
}

export function RelatedQuestions({ questions }: RelatedQuestionsProps) {
    if (!questions || questions.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary/50" />
                Related Questions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {questions.map((q) => (
                    <Link key={q.id} href={`/questions?id=${q.id}`} className="block">
                        <Card className="overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-border/40 bg-card/50">
                            <div className="relative aspect-video bg-muted overflow-hidden">
                                {q.image_url ? (
                                    <Image
                                        src={q.image_url}
                                        alt="Question preview"
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <BookOpen className="h-5 w-5 text-muted-foreground/40" />
                                    </div>
                                )}
                            </div>
                            <div className="p-3 space-y-1">
                                <p className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                                    {q.courses?.title}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-wider px-1 py-0">
                                        {q.courses?.code}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">{q.exam_year}</span>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
