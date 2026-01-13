"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Clock, Download, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface QuestionCardProps {
    question: any;
}

export function QuestionCard({ question }: QuestionCardProps) {
    return (
        <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-muted-foreground/10 bg-card">
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {question.image_url ? (
                    <Image
                        src={question.image_url}
                        alt="Question Preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/30">
                        <div className="flex flex-col items-center gap-2">
                            <BookOpen className="h-8 w-8 opacity-20" />
                            <span className="text-xs font-medium opacity-50">No Preview</span>
                        </div>
                    </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Button size="sm" variant="secondary" className="rounded-full" onClick={() => window.open(question.image_url, '_blank')}>
                        <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                </div>

                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-background/90 backdrop-blur-md shadow-sm border-none font-medium text-foreground">
                        {question.exam_names?.name}
                    </Badge>
                </div>

                <div className="absolute top-3 left-3">
                    <div className="bg-background/90 backdrop-blur-md rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm text-foreground">
                        {question.exam_year}
                    </div>
                </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider border-primary/20 text-primary bg-primary/5">
                        {question.departments?.name}
                    </Badge>
                    {question.session && (
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                            {question.session}
                        </span>
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                        {question.courses?.title}
                    </h3>
                    <div className="text-sm font-mono text-muted-foreground">
                        {question.courses?.code}
                    </div>
                </div>

                {question.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-auto pt-2">
                        {question.description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
