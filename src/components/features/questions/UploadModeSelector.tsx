"use client";

import { useState } from "react";
import { UploadWizard } from "./UploadWizard";
import { BulkUploadWizard } from "./BulkUploadWizard";
import { Upload, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadModeSelectorProps {
    departments: any[];
    examNames: any[];
    academicYears: any[];
}

export function UploadModeSelector({ departments, examNames, academicYears }: UploadModeSelectorProps) {
    const [mode, setMode] = useState<"single" | "bulk">("bulk");

    return (
        <div className="relative">
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div className="flex justify-center mb-8">
                <div className="inline-flex items-center bg-muted/50 rounded-lg p-1 border">
                    <button
                        onClick={() => setMode("bulk")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            mode === "bulk" 
                                ? "bg-background shadow-sm text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Layers className="h-4 w-4" />
                        Bulk Upload
                    </button>
                    <button
                        onClick={() => setMode("single")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                            mode === "single" 
                                ? "bg-background shadow-sm text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Upload className="h-4 w-4" />
                        Single Upload
                    </button>
                </div>
            </div>

            {mode === "bulk" ? (
                <BulkUploadWizard
                    departments={departments}
                    examNames={examNames}
                    academicYears={academicYears}
                />
            ) : (
                <UploadWizard
                    departments={departments}
                    examNames={examNames}
                    academicYears={academicYears}
                />
            )}
        </div>
    );
}
