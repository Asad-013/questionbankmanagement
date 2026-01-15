"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuestionFiltersProps {
    departments: any[];
    examNames: any[];
    academicYears: any[];
}

export function QuestionFilters({ departments, examNames, academicYears }: QuestionFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string) => {
        router.push("/questions?" + createQueryString(name, value));
    };

    const activeFiltersCount = [
        searchParams.get("search"),
        searchParams.get("department_id"),
        searchParams.get("exam_name_id"),
        searchParams.get("year")
    ].filter(Boolean).length;

    return (
        <Card className="sticky top-24 shadow-sm border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Filters
                    </CardTitle>
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="rounded-full h-6 w-6 flex items-center justify-center p-0">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Course name, keywords..."
                            className="pl-9 bg-background focus:ring-primary/20"
                            defaultValue={searchParams.get("search") || ""}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFilterChange("search", (e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Departments */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Department</Label>
                    <div className="relative">
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer hover:bg-accent/50 transition-colors"
                            value={searchParams.get("department_id") || ""}
                            onChange={(e) => handleFilterChange("department_id", e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none opacity-50">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>
                </div>

                {/* Exam Names */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Exam Type</Label>
                    <div className="relative">
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer hover:bg-accent/50 transition-colors"
                            value={searchParams.get("exam_name_id") || ""}
                            onChange={(e) => handleFilterChange("exam_name_id", e.target.value)}
                        >
                            <option value="">All Exams</option>
                            {examNames.map((e) => (
                                <option key={e.id} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none opacity-50">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>
                </div>

                {/* Years */}
                <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Academic Year</Label>
                    <div className="relative">
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer hover:bg-accent/50 transition-colors"
                            value={searchParams.get("year") || ""}
                            onChange={(e) => handleFilterChange("year", e.target.value)}
                        >
                            <option value="">Any Year</option>
                            {academicYears?.map((y) => (
                                <option key={y.id} value={y.name}>{y.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none opacity-50">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>
                </div>

                {activeFiltersCount > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-muted-foreground hover:text-foreground border-dashed"
                        onClick={() => router.push("/questions")}
                    >
                        <X className="mr-2 h-3 w-3" /> Clear Filters
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
