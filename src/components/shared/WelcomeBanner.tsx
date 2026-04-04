"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ShieldCheck, UploadCloud, Rocket, Upload, BookOpen, CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function WelcomeBanner() {
    const searchParams = useSearchParams();
    const welcome = searchParams.get("welcome");
    const [user, setUser] = useState<any>(null);
    const [showWelcome, setShowWelcome] = useState(!!welcome);

    useEffect(() => {
        const checkAuth = async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        checkAuth();
    }, []);

    if (!showWelcome) return null;

    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-full max-w-2xl px-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-6 relative">
                <button
                    onClick={() => setShowWelcome(false)}
                    className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors rounded-full p-1 hover:bg-muted"
                >
                    <X className="h-4 w-4" />
                </button>

                {welcome === "signup" ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Rocket className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Welcome to ILET Archive!</h3>
                                <p className="text-sm text-muted-foreground">Your account has been created. Here&apos;s what you can do next:</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <Link href="/questions" onClick={() => setShowWelcome(false)}>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                    <Search className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-sm font-semibold">Browse Papers</p>
                                        <p className="text-xs text-muted-foreground">Search & download</p>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/upload" onClick={() => setShowWelcome(false)}>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                    <Upload className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-sm font-semibold">Upload Papers</p>
                                        <p className="text-xs text-muted-foreground">Help your batch</p>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/profile" onClick={() => setShowWelcome(false)}>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                                    <ShieldCheck className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                    <div>
                                        <p className="text-sm font-semibold">Your Profile</p>
                                        <p className="text-xs text-muted-foreground">Manage account</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Welcome back!</h3>
                                <p className="text-sm text-muted-foreground">You&apos;re signed in. Jump back into the archive.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/questions" onClick={() => setShowWelcome(false)}>
                                <Button size="sm" className="rounded-full">
                                    <BookOpen className="h-4 w-4 mr-2" /> Browse Questions
                                </Button>
                            </Link>
                            <Link href="/upload" onClick={() => setShowWelcome(false)}>
                                <Button size="sm" variant="outline" className="rounded-full">
                                    <UploadCloud className="h-4 w-4 mr-2" /> Upload Paper
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        checkAuth();
    }, []);

    return { user, loading };
}
