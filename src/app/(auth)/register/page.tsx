"use client";

import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, GraduationCap, FileText, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const BENEFITS = [
    { icon: FileText, text: "Access all past exam papers" },
    { icon: Download, text: "Download papers instantly" },
    { icon: GraduationCap, text: "Better preparation for exams" },
];

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

    const passwordRequirements = [
        { test: password.length >= 8, label: "8+ chars" },
        { test: /[a-z]/.test(password), label: "lowercase" },
        { test: /[A-Z]/.test(password), label: "uppercase" },
        { test: /\d/.test(password), label: "number" },
    ];
    const isPasswordValid = passwordRequirements.every(r => r.test);
    const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const validateEmail = (email: string) => {
        if (!email) {
            setIsEmailValid(null);
            return;
        }
        const isValid = email.includes("@") && email.includes(".");
        setIsEmailValid(isValid);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        validateEmail(value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isPasswordValid) {
            toast.error("Password does not meet requirements");
            return;
        }

        if (!doPasswordsMatch) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("role", "student");

        try {
            const result = await signup(formData);

            if (result?.error) {
                toast.error(result.error);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Signup error", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
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
                <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                <p className="text-muted-foreground text-sm">
                    Join ILET to access and contribute exam questions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={email}
                            onChange={handleEmailChange}
                            className={cn(
                                "h-11 pl-10 pr-10 rounded-xl transition-colors",
                                isEmailValid === true && "border-green-500 bg-green-50 dark:bg-green-950/30",
                                isEmailValid === false && email.length > 0 && "border-red-500 bg-red-50 dark:bg-red-950/30"
                            )}
                        />
                        {isEmailValid !== null && email.length > 0 && (
                            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                {isEmailValid ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                )}
                            </div>
                        )}
                    </div>
                    {isEmailValid === false && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Please enter a valid email address
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            required
                            minLength={8}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    <div className="flex flex-wrap gap-2">
                        {passwordRequirements.map((req, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "text-[10px] px-2 py-1 rounded-full",
                                    req.test ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground"
                                )}
                            >
                                {req.label}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {confirmPassword.length > 0 && !doPasswordsMatch && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Passwords do not match
                        </p>
                    )}
                </div>

                <Button
                    className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
                    type="submit"
                    disabled={isLoading || (isEmailValid === false && email.length > 0) || !isPasswordValid || !doPasswordsMatch}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                    ) : (
                        <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    By signing up, you agree to contribute to the archive and follow community guidelines.
                </p>
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
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
