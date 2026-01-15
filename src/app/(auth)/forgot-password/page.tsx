"use client";

import Link from "next/link";
import { forgotPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Login
                </Link>
            </div>

            <Card className="border-border/50 shadow-xl dark:shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-8 pt-8">
                    <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
                    <p className="text-muted-foreground text-sm">
                        {isSubmitted
                            ? "Check your email for the reset link"
                            : "Enter your email to receive a recovery link"}
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
                    {isSubmitted ? (
                        <div className="text-center space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                We've sent a password reset link to your email address. Please follow the instructions in the email.
                            </p>
                            <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
                                Try another email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="student@university.edu"
                                        required
                                        className="h-11 pl-10 bg-background/50"
                                    />
                                </div>
                            </div>

                            <Button className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
