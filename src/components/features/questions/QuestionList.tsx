"use client";

import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, CheckSquare, Square, X, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionListProps {
    questions: any[];
}

export function QuestionList({ questions }: QuestionListProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDownloading, setIsDownloading] = useState(false);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === questions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(questions.map(q => q.id));
        }
    };

    const handleBulkDownload = async () => {
        if (selectedIds.length === 0) return;

        setIsDownloading(true);
        const zip = new JSZip();
        const selectedQuestions = questions.filter(q => selectedIds.includes(q.id));

        toast.info(`Preparing ${selectedQuestions.length} files...`);

        try {
            const downloadPromises = selectedQuestions.map(async (q) => {
                if (!q.image_url) return;

                try {
                    const response = await fetch(q.image_url);
                    const blob = await response.blob();
                    const fileName = `${q.courses?.code || 'paper'}-${q.exam_year || ''}-${q.id.slice(0, 5)}.jpg`;
                    zip.file(fileName, blob);
                } catch (err) {
                    console.error(`Failed to download ${q.id}:`, err);
                }
            });

            await Promise.all(downloadPromises);

            const content = await zip.generateAsync({ type: "blob" });
            const url = window.URL.createObjectURL(content);
            const link = document.createElement("a");
            link.href = url;
            link.download = `ilet-questions-bulk-${new Date().getTime()}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Download started!");
            setSelectedIds([]);
        } catch (err) {
            console.error("Bulk download failed:", err);
            toast.error("Bulk download failed. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary/50 animate-pulse" />
                        Showing {questions.length} Results
                    </h2>
                    {questions.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                            onClick={toggleSelectAll}
                        >
                            {selectedIds.length === questions.length ? (
                                <><X className="h-3 w-3 mr-1.5" /> Deselect All</>
                            ) : (
                                <><CheckSquare className="h-3 w-3 mr-1.5" /> Select All</>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                {questions.map((q) => (
                    <div key={q.id} className="relative group">
                        <div
                            className={`absolute top-4 left-4 z-20 transition-opacity duration-200 ${selectedIds.includes(q.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSelect(q.id);
                            }}
                        >
                            <Checkbox
                                checked={selectedIds.includes(q.id)}
                                onCheckedChange={() => toggleSelect(q.id)}
                                className="h-5 w-5 bg-white/90 dark:bg-black/90 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground shadow-lg"
                            />
                        </div>
                        <QuestionCard
                            question={q}
                            isSelected={selectedIds.includes(q.id)}
                            onSelect={() => toggleSelect(q.id)}
                        />
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 inset-x-0 mx-auto w-fit z-[100]"
                    >
                        <div className="bg-black/80 dark:bg-white/90 text-white dark:text-black backdrop-blur-xl border border-white/10 dark:border-black/10 px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl">
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <span className="bg-primary text-primary-foreground h-6 min-w-[24px] px-1.5 rounded-full flex items-center justify-center text-xs animate-in zoom-in duration-300">
                                    {selectedIds.length}
                                </span>
                                <span>Items Selected</span>
                            </div>

                            <div className="h-6 w-px bg-white/20 dark:bg-black/20" />

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    disabled={isDownloading}
                                    onClick={handleBulkDownload}
                                    className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 font-bold"
                                >
                                    {isDownloading ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 mr-2" />
                                    )}
                                    {isDownloading ? "Zipping..." : `Download Zip`}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedIds([])}
                                    className="rounded-full h-9 w-9 hover:bg-white/10 dark:hover:bg-black/5"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
