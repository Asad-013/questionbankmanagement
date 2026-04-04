"use client";

import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ShieldCheck, User, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle, GraduationCap, FileText, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

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

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-12 flex-col justify-between text-white">
                <div>
                    <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                        <GraduationCap className="h-6 w-6" />
                        <span className="font-bold">ILET Archive</span>
                    </Link>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight">
                            Join the ILET
                            <br />Community
                        </h1>
                        <p className="text-white/80 text-lg">
                            Get instant access to past exam papers and help build the archive for future generations.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {BENEFITS.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <benefit.icon className="h-5 w-5" />
                                </div>
                                <span className="text-white/90">{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/20">
                        <p className="text-white/60 text-sm">
                            Trusted by 500+ students from University of Dhaka
                        </p>
                    </div>
                </div>

                <div className="text-white/60 text-sm">
                    &copy; 2024 ILET Archive. All rights reserved.
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="lg:hidden space-y-2">
                        <Link href="/" className="flex items-center gap-2 text-primary">
                            <GraduationCap className="h-6 w-6" />
                            <span className="font-bold">ILET Archive</span>
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                        <p className="text-muted-foreground">
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
                                        "h-12 pl-10 pr-10 rounded-xl transition-colors",
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
                                    className="h-12 pl-10 pr-10 rounded-xl"
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
                                {[
                                    { test: password.length >= 8, label: "8+ chars" },
                                    { test: /[a-z]/.test(password), label: "lowercase" },
                                    { test: /[A-Z]/.test(password), label: "uppercase" },
                                    { test: /\d/.test(password), label: "number" },
                                ].map((req, i) => (
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

                        <Button
                            className="w-full h-12 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50"
                            type="submit"
                            disabled={isLoading || (isEmailValid === false && email.length > 0)}
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

                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
