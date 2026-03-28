"use client";

import Link from "next/link";
import { forgotPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await forgotPassword(formData);
            if (result?.error) {
                toast.error(result.error);
                setIsLoading(false);
            } else {
                setIsSubmitted(true);
                toast.success("Reset link sent!");
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to sign in
            </Link>

            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
                <p className="text-muted-foreground text-sm">
                    {isSubmitted
                        ? "Check your email for the reset link."
                        : "Enter your email and we'll send you a reset link."}
                </p>
            </div>

            {isSubmitted ? (
                <div className="text-center space-y-5 animate-in zoom-in-95 duration-300">
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
                        We&apos;ve sent a password reset link to your email. Follow the instructions to reset your password.
                    </p>
                    <Button
                        variant="outline"
                        className="w-full h-11 rounded-xl"
                        onClick={() => setIsSubmitted(false)}
                    >
                        Try another email
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="student@university.edu"
                                required
                                className="h-11 pl-10 rounded-xl"
                            />
                        </div>
                    </div>

                    <Button
                        className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                Send Reset Link
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            )}
        </div>
    );
}
