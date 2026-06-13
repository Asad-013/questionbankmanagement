"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
    Upload, ChevronRight, ChevronLeft, Check, Loader2, 
    FileImage, Image as ImageIcon, Send, X, Edit3, 
    GripVertical, AlertCircle, CheckCircle2, CloudUpload,
    Layers, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { bulkUploadSchema, type BulkUploadFormData, type BulkUploadItem } from "@/lib/validations/upload";
import { getCoursesByDepartment } from "@/lib/actions/taxonomy";
import { uploadBulkQuestions } from "@/lib/actions/questions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface BulkUploadWizardProps {
    departments: any[];
    examNames: any[];
    academicYears: any[];
}

export function BulkUploadWizard({ departments, examNames, academicYears }: BulkUploadWizardProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [uploadItems, setUploadItems] = useState<BulkUploadItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const form = useForm<BulkUploadFormData>({
        resolver: zodResolver(bulkUploadSchema) as any,
        defaultValues: {
            exam_year: new Date().getFullYear(),
        },
        mode: "onChange",
    });

    const { watch, register, formState: { errors }, trigger } = form;
    const selectedDepartment = watch("department_id");

    useEffect(() => {
        if (selectedDepartment) {
            const fetchCourses = async () => {
                setLoadingCourses(true);
                const data = await getCoursesByDepartment(selectedDepartment);
                setCourses(data || []);
                setLoadingCourses(false);
            };
            fetchCourses();
        } else {
            setCourses([]);
        }
    }, [selectedDepartment]);

    const generateId = () => Math.random().toString(36).substring(2, 9);

    const processFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const validFiles: BulkUploadItem[] = [];
        const errors: string[] = [];

        for (const file of fileArray) {
            if (!file.type.startsWith("image/")) {
                errors.push(`${file.name}: Not an image file`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: File too large (max 10MB)`);
                continue;
            }
            if (uploadItems.length + validFiles.length >= MAX_FILES) {
                errors.push(`${file.name}: Maximum ${MAX_FILES} files allowed`);
                continue;
            }

            const previewUrl = URL.createObjectURL(file);
            const existingCount = uploadItems.length + validFiles.length + 1;
            validFiles.push({
                id: generateId(),
                file,
                previewUrl,
                name: `Question ${existingCount}`,
            });
        }

        if (errors.length > 0) {
            errors.forEach(err => toast.error(err));
        }

        return validFiles;
    }, [uploadItems.length]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newItems = processFiles(e.target.files);
            setUploadItems(prev => [...prev, ...newItems]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files) {
            const newItems = processFiles(e.dataTransfer.files);
            setUploadItems(prev => [...prev, ...newItems]);
        }
    }, [processFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    }, []);

    const removeItem = (id: string) => {
        setUploadItems(prev => {
            const item = prev.find(i => i.id === id);
            if (item) {
                URL.revokeObjectURL(item.previewUrl);
            }
            return prev.filter(i => i.id !== id);
        });
    };

    const updateItemName = (id: string, name: string) => {
        setUploadItems(prev => prev.map(item => 
            item.id === id ? { ...item, name } : item
        ));
    };

    const clearAll = () => {
        uploadItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
        setUploadItems([]);
    };

    const nextStep = async () => {
        if (step === 1) {
            const isValid = await trigger(["department_id", "course_id", "exam_name_id", "exam_year"]);
            if (isValid) setStep(2);
        } else if (step === 2) {
            if (uploadItems.length > 0) {
                const hasEmptyNames = uploadItems.some(item => !item.name.trim());
                if (hasEmptyNames) {
                    toast.error("Please name all questions before uploading");
                    return;
                }
                setStep(3);
            }
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const onSubmit = async (data: BulkUploadFormData) => {
        if (uploadItems.length === 0) return;
        
        setIsSubmitting(true);
        const toastId = toast.loading(`Uploading ${uploadItems.length} questions...`);

        try {
            const files = uploadItems.map(item => ({
                name: item.name,
                blob: item.file,
                type: item.file.type,
            }));

            const result = await uploadBulkQuestions(files, data);

            if (!result.success) {
                throw new Error(result.error || "Upload failed");
            }

            let message = `${result.uploaded} question(s) uploaded successfully!`;
            if (result.failed && result.failed > 0) {
                message += ` ${result.failed} failed.`;
            }
            toast.success(message, { id: toastId });

            uploadItems.forEach(item => URL.revokeObjectURL(item.previewUrl));
            setUploadItems([]);
            router.push("/questions");
            router.refresh();

        } catch (error: any) {
            console.error("Bulk upload failed", error);
            toast.error(`Upload failed: ${error.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-300 -z-0 rounded-full" style={{ width: `${((step - 1) / 2) * 100}%` }} />

                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold text-sm",
                                step >= s ? "border-primary bg-primary text-primary-foreground shadow-lg" : "border-muted-foreground/30 text-muted-foreground bg-background"
                            )}>
                                {step > s ? <Check className="h-5 w-5" /> : s}
                            </div>
                            <span className={cn("text-xs font-medium uppercase tracking-wider", step >= s ? "text-primary" : "text-muted-foreground")}>
                                {s === 1 && "Details"}
                                {s === 2 && "Upload"}
                                {s === 3 && "Review"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        {step === 1 && <><Layers className="h-6 w-6" /> Bulk Upload</>}
                        {step === 2 && <><Upload className="h-6 w-6" /> Select Images</>}
                        {step === 3 && <><CheckCircle2 className="h-6 w-6" /> Review</>}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Set shared metadata for all questions in this batch."}
                        {step === 2 && `Upload ${uploadItems.length}/${MAX_FILES} images. Each can be renamed before upload.`}
                        {step === 3 && "Review your batch before submitting to moderation."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="min-h-[350px]">
                    {step === 1 && (
                        <div className="grid gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <div className="relative">
                                        <select
                                            {...register("department_id")}
                                            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted/50 transition-colors cursor-pointer appearance-none"
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(d => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronRight className="rotate-90 h-4 w-4" /></div>
                                    </div>
                                    {errors.department_id && <p className="text-sm text-destructive">{errors.department_id.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label>Course</Label>
                                    <div className="relative">
                                        <select
                                            {...register("course_id")}
                                            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 hover:bg-muted/50 transition-colors cursor-pointer appearance-none"
                                            disabled={!selectedDepartment || loadingCourses}
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => (
                                                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronRight className="rotate-90 h-4 w-4" /></div>
                                    </div>
                                    {errors.course_id && <p className="text-sm text-destructive">{errors.course_id.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Exam Information</Label>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="relative">
                                        <select
                                            {...register("exam_name_id")}
                                            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                                        >
                                            <option value="">Exam Name</option>
                                            {examNames.map(e => (
                                                <option key={e.id} value={e.id}>{e.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronRight className="rotate-90 h-4 w-4" /></div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            {...register("exam_year", { valueAsNumber: true })}
                                            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm appearance-none"
                                        >
                                            <option value="">Year</option>
                                            {academicYears?.map(y => (
                                                <option key={y.id} value={y.name}>{y.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronRight className="rotate-90 h-4 w-4" /></div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            {...register("session")}
                                            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
                                        >
                                            <option value="">Session (Optional)</option>
                                            <option value="Spring">Spring</option>
                                            <option value="Summer">Summer</option>
                                            <option value="Fall">Fall</option>
                                            <option value="Winter">Winter</option>
                                        </select>
                                        <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronRight className="rotate-90 h-4 w-4" /></div>
                                    </div>
                                </div>
                                {errors.exam_name_id && <p className="text-sm text-destructive">{errors.exam_name_id.message}</p>}
                                {errors.exam_year && <p className="text-sm text-destructive">{errors.exam_year.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Subject <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                <Input {...register("subject")} className="h-11" placeholder="e.g., Midterm, Final Exam, Quiz 1..." />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-200">
                                <div className="shrink-0 mt-0.5"><AlertCircle className="h-4 w-4" /></div>
                                <p>All uploaded images will share this metadata. You can rename each question individually in the next step.</p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer",
                                    dragActive 
                                        ? "border-primary bg-primary/10 scale-[1.02]" 
                                        : "border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10"
                                )}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <div className="h-16 w-16 rounded-full bg-background shadow-lg flex items-center justify-center mb-4">
                                    <CloudUpload className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Drop images here or click to browse</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Supports JPEG, PNG, WebP, GIF up to 10MB each
                                </p>
                                <div className="flex gap-2">
                                    <Badge variant="secondary">.JPG</Badge>
                                    <Badge variant="secondary">.PNG</Badge>
                                    <Badge variant="secondary">.WEBP</Badge>
                                    <Badge variant="secondary">.GIF</Badge>
                                </div>
                            </div>

                            {uploadItems.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {uploadItems.length} question{uploadItems.length !== 1 ? "s" : ""} selected
                                        </h3>
                                        <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                                            Clear All
                                        </Button>
                                    </div>

                                    <div className="grid gap-3 max-h-[300px] overflow-y-auto pr-2">
                                        {uploadItems.map((item, index) => (
                                            <div 
                                                key={item.id}
                                                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border group hover:border-primary/30 transition-colors"
                                            >
                                                <div className="shrink-0 text-muted-foreground/50">
                                                    <GripVertical className="h-4 w-4" />
                                                </div>
                                                
                                                <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={item.previewUrl} 
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) => updateItemName(item.id, e.target.value)}
                                                        className="h-8 text-sm font-medium"
                                                        placeholder="Question name"
                                                    />
                                                </div>

                                                <div className="shrink-0 text-xs text-muted-foreground">
                                                    {(item.file.size / 1024 / 1024).toFixed(1)}MB
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {uploadItems.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FileImage className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                    <p>No images selected yet</p>
                                    <p className="text-sm">Select up to {MAX_FILES} images to upload</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/20 rounded-lg space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Department</Label>
                                    <div className="font-semibold">{departments.find(d => d.id === watch("department_id"))?.name}</div>
                                </div>
                                <div className="p-4 bg-muted/20 rounded-lg space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Course</Label>
                                    <div className="font-semibold">{courses.find(c => c.id === watch("course_id"))?.code}</div>
                                </div>
                            </div>

                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-2">
                                <Label className="text-xs text-primary/80 uppercase tracking-wider">Exam Details</Label>
                                <div className="font-bold text-xl text-primary">
                                    {examNames.find(e => e.id === watch("exam_name_id"))?.name}
                                </div>
                                <div className="text-sm font-medium flex gap-4">
                                    <span>{watch("exam_year")}</span>
                                    {watch("session") && <span>{watch("session")}</span>}
                                    {watch("subject") && <span className="text-muted-foreground">- {watch("subject")}</span>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium">Questions to Upload ({uploadItems.length})</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[200px] overflow-y-auto pr-2">
                                    {uploadItems.map((item) => (
                                        <div key={item.id} className="relative group rounded-lg overflow-hidden bg-muted/30 border">
                                            <div className="aspect-square">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img 
                                                    src={item.previewUrl} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                <p className="text-white text-xs font-medium truncate">{item.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
                                <div className="shrink-0 mt-0.5"><CheckCircle2 className="h-4 w-4" /></div>
                                <p>All {uploadItems.length} question(s) will be submitted for moderation. You can upload up to 5 questions per hour.</p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between p-6 bg-muted/10 border-t">
                    <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isSubmitting} className="hover:bg-background/80">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>

                    {step < 3 ? (
                        <Button onClick={nextStep} disabled={(step === 2 && uploadItems.length === 0)} className="pl-6 pr-4">
                            Next Step <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={form.handleSubmit(onSubmit)} 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground pl-6 pr-6 shadow-lg shadow-primary/20" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                            ) : (
                                <><Send className="h-4 w-4 mr-2" /> Submit {uploadItems.length} Question{uploadItems.length !== 1 ? "s" : ""}</>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
