"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, ChevronRight, ChevronLeft, Check, Loader2, FileImage, LayoutGrid, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { uploadSchema, type UploadFormData } from "@/lib/validations/upload";
import { getCoursesByDepartment } from "@/lib/actions/taxonomy";
import { createQuestion } from "@/lib/actions/questions";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface UploadWizardProps {
    departments: any[];
    examNames: any[];
    academicYears: any[];
}

export function UploadWizard({ departments, examNames, academicYears }: UploadWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [courses, setCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema) as any,
        defaultValues: {
            exam_year: new Date().getFullYear(),
            tags: [],
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const nextStep = async () => {
        const isValid = await trigger();
        if (step === 1 && isValid) {
            setStep(2);
        } else if (step === 2 && selectedImage) {
            setStep(3);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const onSubmit = async (data: UploadFormData) => {
        if (!selectedImage) return;
        setIsSubmitting(true);
        const toastId = toast.loading("Uploading question...");

        try {
            const supabase = createClient();
            const fileExt = selectedImage.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload Image
            const { error: uploadError } = await supabase.storage
                .from("questions")
                .upload(filePath, selectedImage);

            if (uploadError) throw new Error(uploadError.message);

            const { data: { publicUrl } } = supabase.storage.from("questions").getPublicUrl(filePath);

            const result = await createQuestion(data, publicUrl);

            if (!result.success) throw new Error(result.error);

            toast.success("Question submitted successfully!", { id: toastId });
            router.push("/questions");
            router.refresh();

        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(`Upload failed: ${error.message}`, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Steps Progress */}
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
                    <CardTitle className="text-2xl">
                        {step === 1 && "Categorize Question"}
                        {step === 2 && "Upload Document"}
                        {step === 3 && "Ready to Submit?"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Provide the academic details to help others find this resource."}
                        {step === 2 && "Upload a clear image or scan of the exam paper."}
                        {step === 3 && "Review your submission before sending it to moderation."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="min-h-[300px]">
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
                                <Label>Notes</Label>
                                <Input {...register("description")} className="h-11" placeholder="Topics covered, sections, or specific instructions..." />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-2 border-dashed border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all duration-300 rounded-2xl h-[400px] flex flex-col items-center justify-center relative cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                    onChange={handleImageSelect}
                                />
                                {previewUrl ? (
                                    <div className="relative w-full h-full p-4">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain drop-shadow-md" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 backdrop-blur-sm rounded-xl m-4">
                                            <div className="text-white font-medium flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5" /> Change Image
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="h-20 w-20 rounded-full bg-background shadow-lg flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                                            <Upload className="h-8 w-8 text-primary" />
                                        </div>
                                        <h3 className="text-xl font-bold mb-2">Upload Question Paper</h3>
                                        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                            Drag and drop your file here, or click to browse. Supports high-quality images.
                                        </p>
                                        <Badge variant="secondary" className="mr-2">.JPG</Badge>
                                        <Badge variant="secondary" className="mr-2">.PNG</Badge>
                                        <Badge variant="secondary">.WEBP</Badge>
                                    </div>
                                )}
                            </div>
                            {!selectedImage && <p className="text-center text-sm text-destructive mt-4 font-medium">Please select a file to continue</p>}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3 aspect-[3/4] bg-muted/30 rounded-xl overflow-hidden border shadow-inner flex items-center justify-center relative">
                                    {previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <FileImage className="h-12 w-12 text-muted-foreground/30" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-muted/20 rounded-lg space-y-1">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Department</Label>
                                            <div className="font-semibold text-lg">{departments.find(d => d.id === watch("department_id"))?.name}</div>
                                        </div>
                                        <div className="p-4 bg-muted/20 rounded-lg space-y-1">
                                            <Label className="text-xs text-muted-foreground uppercase tracking-wider">Course</Label>
                                            <div className="font-semibold text-lg">{courses.find(c => c.id === watch("course_id"))?.code}</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg space-y-1">
                                        <Label className="text-xs text-primary/80 uppercase tracking-wider">Exam Details</Label>
                                        <div className="font-bold text-xl text-primary">
                                            {examNames.find(e => e.id === watch("exam_name_id"))?.name}
                                        </div>
                                        <div className="text-sm font-medium">
                                            {watch("exam_year")} {watch("session")}
                                        </div>
                                    </div>

                                    {watch("description") && (
                                        <div className="space-y-2">
                                            <Label className="text-sm">Additional Notes</Label>
                                            <p className="text-sm text-muted-foreground p-3 bg-muted/20 rounded-lg border-l-2 border-primary">
                                                {watch("description")}
                                            </p>
                                        </div>
                                    )}

                                    <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg flex gap-3 text-sm text-yellow-800 dark:text-yellow-200">
                                        <div className="shrink-0 mt-0.5"><Check className="h-4 w-4" /></div>
                                        <p>By submitting, you confirm this content is accurate and legible. It will be reviewed by a moderator before going public.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between p-6 bg-muted/10 border-t">
                    <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isSubmitting} className="hover:bg-background/80">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Back
                    </Button>

                    {step < 3 ? (
                        <Button onClick={nextStep} disabled={(step === 2 && !selectedImage)} className="pl-6 pr-4">
                            Next Step <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={form.handleSubmit(onSubmit)} className="bg-primary hover:bg-primary/90 text-primary-foreground pl-6 pr-6 shadow-lg shadow-primary/20" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Publishing...</> : <><Send className="h-4 w-4 mr-2" /> Submit Question</>}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
