"use client";

import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();

    // SECURITY FIX (VULN-12): Use a whitelist to prevent open phishing via URL params.
    // An attacker could craft /login?message=Your+account+is+suspended.+Enter+credentials
    // to social-engineer users. Only pre-approved keys are rendered as messages.
    const ALLOWED_MESSAGES: Record<string, string> = {
        "password-updated": "Password updated successfully. Please sign in.",
        "session-expired": "Your session has expired. Please sign in again.",
        "email-confirmed": "Email confirmed! You can now sign in.",
    };
    const msgKey = searchParams.get("msg");
    const resetMessage = msgKey ? (ALLOWED_MESSAGES[msgKey] ?? null) : null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await login(formData);
            if (result?.error) {
                toast.error(result.error);
                setIsLoading(false);
            } else {
                toast.success("Welcome back!");
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) {
                toast.error("Google sign-in failed. Please try again.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground text-sm">
                    Sign in to access the ILET question archive.
                </p>
            </div>

            {resetMessage && (
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm animate-in fade-in zoom-in-95 duration-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>{resetMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="h-11 pl-10 rounded-xl"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                            Forgot?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="h-11 pl-10 pr-10 rounded-xl"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <Button
                    className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                        </>
                    ) : (
                        <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-muted"></div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all active:scale-[0.98]"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
            >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                        fill="#EA4335"
                        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.091 14.982 0 12 0 7.354 0 3.307 2.68 1.285 6.56l3.981 3.205z"
                    />
                    <path
                        fill="#34A853"
                        d="M16.04 15.345c-1.077.733-2.427 1.164-4.04 1.164-2.936 0-5.427-1.982-6.31-4.654L1.71 15.06A11.976 11.976 0 0 0 12 24c3.273 0 6.018-1.09 8.027-2.945l-4.027-3.21-1.96 1.5z"
                    />
                    <path
                        fill="#4285F4"
                        d="M23.49 12.273c0-.818-.073-1.609-.209-2.373H12v4.5h6.49c-.282 1.482-1.12 2.74-2.38 3.59l4.027 3.21c2.355-2.173 3.71-5.373 3.71-8.927z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.69 11.855a7.11 7.11 0 0 1 0-2.2L1.71 6.45A11.988 11.988 0 0 0 0 12c0 1.98.48 3.855 1.336 5.5l3.982-3.11a7.11 7.11 0 0 1 .372-2.535z"
                    />
                </svg>
                Continue with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-semibold text-primary hover:underline transition-colors">
                    Create one
                </Link>
            </div>
        </div>
    );
}
