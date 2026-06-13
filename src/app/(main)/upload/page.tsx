import { getTaxonomyItems } from "@/lib/actions/taxonomy";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, Lock, Download, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadModeSelector } from "@/components/features/questions/UploadModeSelector";

export default async function UploadPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                <div className="container mx-auto px-4 max-w-5xl py-20">
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background shadow-sm text-primary font-medium mb-4">
                            <Sparkles className="h-3 w-3 mr-2" /> Contribution Mode
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Help Build the Archive</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Uploading a single question paper saves hours for everyone. Join your classmates in building the most comprehensive ILET Leather Engineering resource.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                            <div className="relative bg-background border border-border/50 rounded-xl p-8 h-full">
                                <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                                    <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Download & Browse</h3>
                                <p className="text-muted-foreground mb-4">
                                    Anyone can explore and download question papers from our repository. No account needed - just start browsing!
                                </p>
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href="/questions">
                                        <Search className="h-4 w-4 mr-2" /> Browse Questions
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                            <div className="relative bg-background border border-border/50 rounded-xl p-8 h-full">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Contribute & Upload</h3>
                                <p className="text-muted-foreground mb-4">
                                    Sign in to upload question papers and help grow the archive. Your contribution makes a difference!
                                </p>
                                <div className="flex gap-3">
                                    <Button asChild className="flex-1">
                                        <Link href="/login">Sign In</Link>
                                    </Button>
                                    <Button variant="outline" asChild className="flex-1">
                                        <Link href="/register">Create Account</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const [departments, examNames, academicYears] = await Promise.all([
        getTaxonomyItems("departments"),
        getTaxonomyItems("exam_names"),
        getTaxonomyItems("academic_years"),
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 max-w-5xl py-12 md:py-20">
                <div className="text-center mb-8 space-y-4">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background shadow-sm text-primary font-medium mb-4">
                        <Sparkles className="h-3 w-3 mr-2" /> Contribution Mode
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Support Your Classmates</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Uploading question papers saves hours for everyone. Choose single or bulk upload below.
                    </p>
                </div>

                <UploadModeSelector
                    departments={departments || []}
                    examNames={examNames || []}
                    academicYears={academicYears || []}
                />
            </div>
        </div>
    );
}
