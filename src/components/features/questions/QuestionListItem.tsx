"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    BookOpen,
    Calendar,
    Clock,
    Download,
    Eye,
    Bookmark,
    BookmarkCheck,
    Share2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ImageViewer } from "./ImageViewer";
import { toast } from "sonner";

interface QuestionListItemProps {
    question: any;
    isSelected?: boolean;
    onSelect?: () => void;
    isBookmarked?: boolean;
    onToggleBookmark?: () => void;
}

export function QuestionListItem({
    question,
    isSelected,
    onSelect,
    isBookmarked,
    onToggleBookmark,
}: QuestionListItemProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);

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
        const url = `${window.location.origin}/questions?id=${question.id}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success("Link copied!");
        } catch {
            toast.error("Failed to copy link");
        }
    }, [question.id]);

    return (
        <>
            <div
                className={cn(
                    "group flex items-center gap-4 p-4 rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-lg hover:border-border transition-all duration-200 cursor-pointer",
                    isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 bg-primary/5"
                )}
                onClick={onSelect}
            >
                {/* Checkbox */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.();
                    }}
                >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelect?.()}
                        className="h-5 w-5 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                </div>

                {/* Thumbnail */}
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border/50">
                    {question.image_url ? (
                        <Image
                            src={question.image_url}
                            alt="Question thumbnail"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-4 w-4 text-muted-foreground/40" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge
                            variant="outline"
                            className="text-[9px] font-bold uppercase tracking-wider border-primary/20 text-primary bg-primary/5 px-1.5 py-0"
                        >
                            {question.departments?.name}
                        </Badge>
                        <Badge
                            variant="secondary"
                            className="text-[9px] font-medium px-1.5 py-0"
                        >
                            {question.exam_names?.name}
                        </Badge>
                    </div>
                    <Link href={`/questions/${question.id}`} onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {question.courses?.title}
                        </h3>
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="font-mono">{question.courses?.code}</span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {question.exam_year}
                        </span>
                        {question.session && (
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {question.session}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsViewerOpen(true);
                        }}
                        title="View"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                        title="Download"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                        }}
                        title="Copy link"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-8 w-8 rounded-full",
                            isBookmarked && "text-yellow-500"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark?.();
                        }}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                        {isBookmarked ? (
                            <BookmarkCheck className="h-4 w-4" />
                        ) : (
                            <Bookmark className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            <ImageViewer
                images={question.image_url ? [question.image_url] : []}
                title={question.courses?.title}
                subtitle={`${question.courses?.code} - ${question.exam_year}`}
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
            />
        </>
    );
}
