import { getTaxonomyItems } from "@/lib/actions/taxonomy";
import { createClient } from "@/lib/supabase/server";
import { UploadWizard } from "@/components/features/questions/UploadWizard";
import { Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function UploadPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md mx-auto px-4">
                    <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold">Login Required</h1>
                    <p className="text-muted-foreground">
                        You need to be logged in to upload questions. Sign in or create an account to start contributing.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/register">Create Account</Link>
                        </Button>
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
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background shadow-sm text-primary font-medium mb-4">
                        <Sparkles className="h-3 w-3 mr-2" /> Contribution Mode
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Support Your Classmates</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Uploading a single paper saves hours for everyone. Help build the most comprehensive archive for ILET Leather Engineering students.
                    </p>
                </div>

                <div className="relative">
                    {/* Decorative blobs */}
                    <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10" />

                    <UploadWizard
                        departments={departments || []}
                        examNames={examNames || []}
                        academicYears={academicYears || []}
                    />
                </div>
            </div>
        </div>
    );
}
