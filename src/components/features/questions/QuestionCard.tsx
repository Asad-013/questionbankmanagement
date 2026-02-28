"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Clock, Download, Eye, X, ZoomIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: any;
    isSelected?: boolean;
    onSelect?: () => void;
}

export function QuestionCard({ question, isSelected, onSelect }: QuestionCardProps) {
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const handleDownload = async () => {
        if (!question.image_url) return;

        try {
            const response = await fetch(question.image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `question-${question.courses?.code || 'paper'}-${question.exam_year || ''}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(question.image_url, '_blank');
        }
    };

    return (
        <Card
            className={cn(
                "overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col border-border/40 bg-card/50 backdrop-blur-sm cursor-pointer relative",
                isSelected && "ring-2 ring-primary ring-offset-2 border-primary/50 bg-primary/5"
            )}
            onClick={onSelect}
        >
            <div className="relative aspect-video bg-muted overflow-hidden border-b border-border/50">
                {question.image_url ? (
                    <Image
                        src={question.image_url}
                        alt="Question Preview"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/30">
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-background/50 rounded-full backdrop-blur-md shadow-sm">
                                <BookOpen className="h-6 w-6 opacity-40" />
                            </div>
                            <span className="text-xs font-medium opacity-50 uppercase tracking-widest">No Preview</span>
                        </div>
                    </div>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button
                        size="sm"
                        className="rounded-full bg-white/90 text-black hover:bg-white shadow-lg font-medium"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsViewerOpen(true);
                        }}
                    >
                        <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full bg-black/50 text-white border-white/20 hover:bg-black/70 shadow-lg font-medium"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                        }}
                    >
                        <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                </div>

                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-sm border-transparent font-medium text-foreground hover:bg-white dark:hover:bg-black">
                        {question.exam_names?.name}
                    </Badge>
                </div>

                <div className="absolute top-3 left-3">
                    <div className="bg-black/80 dark:bg-white/90 text-white dark:text-black backdrop-blur-md rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {question.exam_year}
                    </div>
                </div>
            </div>

            <CardContent className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider border-primary/20 text-primary bg-primary/5 px-2 py-0.5">
                        {question.departments?.name}
                    </Badge>
                    {question.session && (
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            {question.session}
                        </span>
                    )}
                </div>

                <div className="space-y-1.5">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1" title={question.courses?.title}>
                        {question.courses?.title}
                    </h3>
                    <div className="text-sm font-mono text-muted-foreground flex items-center gap-2">
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-bold">CODE</span>
                        {question.courses?.code}
                    </div>
                </div>

                {question.description && (
                    <div className="mt-auto pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {question.description}
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Added recently</span>
                <Download
                    className="h-4 w-4 hover:text-primary cursor-pointer transition-colors"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDownload();
                    }}
                />
            </CardFooter>

            {/* Advanced Full Screen Image Viewer */}
            {isViewerOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsViewerOpen(false);
                    }}
                >
                    <div className="absolute top-4 right-4 flex gap-4 z-[101]">
                        <Button
                            variant="outline"
                            className="rounded-full bg-black/50 text-white border-white/20 hover:bg-white hover:text-black font-medium transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload();
                            }}
                        >
                            <Download className="h-4 w-4 mr-2" /> Download
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full bg-black/50 text-white border-white/20 hover:bg-red-500 hover:text-white transition-all hover:border-red-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsViewerOpen(false);
                            }}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] p-8 mt-12 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                        {question.image_url && (
                            <img
                                src={question.image_url}
                                alt="Full screen preview"
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl ring-1 ring-white/10"
                                onClick={(e) => e.stopPropagation()} // Prevent close when clicking the image itself
                            />
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-full backdrop-blur-md text-sm font-medium border border-white/10 shadow-xl flex items-center gap-2">
                            <ZoomIn className="h-4 w-4 text-primary" />
                            {question.courses?.code} - {question.exam_year}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
