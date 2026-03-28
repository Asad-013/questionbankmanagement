"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    Clock,
    Download,
    Eye,
    Bookmark,
    BookmarkCheck,
    Share2,
    Copy,
} from "lucide-react";
import { ImageViewer } from "./ImageViewer";
import { RelatedQuestions } from "./RelatedQuestions";
import { useBookmarks } from "@/hooks/useBookmarks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuestionDetailProps {
    question: any;
    relatedQuestions: any[];
}

export function QuestionDetail({ question, relatedQuestions }: QuestionDetailProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const { isBookmarked, toggleBookmark } = useBookmarks();

    const handleDownload = useCallback(async () => {
        if (!question.image_url) return;
        try {
            const response = await fetch(question.image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `question-${question.courses?.code || "paper"}-${question.exam_year || ""}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch {
            window.open(question.image_url, "_blank");
        }
    }, [question]);

    const handleShare = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch {
            toast.error("Failed to copy link");
        }
    }, []);

    return (
        <div className="container px-4 md:px-6 py-10 max-w-5xl mx-auto">
            {/* Back button */}
            <Link href="/questions">
                <Button variant="ghost" className="mb-6 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Repository
                </Button>
            </Link>

            <div className="grid lg:grid-cols-5 gap-8">
                {/* Image section */}
                <div className="lg:col-span-3">
                    <div
                        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted border border-border/50 cursor-pointer group"
                        onClick={() => setIsViewerOpen(true)}
                    >
                        {question.image_url ? (
                            <>
                                <Image
                                    src={question.image_url}
                                    alt="Question paper"
                                    fill
                                    className="object-contain group-hover:scale-[1.02] transition-transform duration-300"
                                    priority
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button className="rounded-full bg-white/90 text-black hover:bg-white shadow-lg">
                                            <Eye className="h-4 w-4 mr-2" /> Click to Zoom
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Info section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                                variant="outline"
                                className="text-xs font-bold uppercase tracking-wider border-primary/20 text-primary bg-primary/5"
                            >
                                {question.departments?.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                                {question.exam_names?.name}
                            </Badge>
                        </div>

                        <h1 className="text-2xl font-bold leading-tight">
                            {question.courses?.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-mono bg-muted px-2 py-1 rounded text-xs font-bold">
                                {question.courses?.code}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {question.exam_year}
                            </span>
                            {question.session && (
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {question.session}
                                </span>
                            )}
                        </div>

                        {question.description && (
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {question.description}
                            </p>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleDownload} className="flex-1">
                            <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => toggleBookmark(question.id)}
                            className={cn(isBookmarked(question.id) && "text-yellow-500")}
                        >
                            {isBookmarked(question.id) ? (
                                <BookmarkCheck className="h-4 w-4" />
                            ) : (
                                <Bookmark className="h-4 w-4" />
                            )}
                        </Button>
                        <Button variant="outline" onClick={handleShare}>
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Metadata */}
                    <Card className="p-4 bg-muted/30 border-border/50">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Department</span>
                                <span className="font-medium">{question.departments?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Course</span>
                                <span className="font-medium">{question.courses?.code}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Exam</span>
                                <span className="font-medium">{question.exam_names?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Year</span>
                                <span className="font-medium">{question.exam_year}</span>
                            </div>
                            {question.session && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Session</span>
                                    <span className="font-medium">{question.session}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Related Questions */}
            <RelatedQuestions questions={relatedQuestions} />

            {/* Image Viewer */}
            <ImageViewer
                images={question.image_url ? [question.image_url] : []}
                title={question.courses?.title}
                subtitle={`${question.courses?.code} - ${question.exam_year}`}
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
            />
        </div>
    );
}
