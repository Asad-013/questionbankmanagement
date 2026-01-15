"use client";

import Link from "next/link";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                // Redirect handled by server action
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Home
                </Link>
            </div>

            <Card className="border-border/50 shadow-xl dark:shadow-primary/5 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pb-8 pt-8">
                    <h1 className="text-3xl font-bold tracking-tight">ILET Archive Login</h1>
                    <p className="text-muted-foreground text-sm">
                        Access the repository of Leather Engineering papers
                    </p>
                </CardHeader>
                <CardContent className="space-y-6 pb-8">
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
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    className="h-11 pl-10 pr-10 bg-background/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Student or Staff
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                            Create an account
                        </Link>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dashed border-border/50 text-center">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
                        >
                            <div className="h-6 w-6 rounded-full bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                <Shield className="h-3.5 w-3.5" />
                            </div>
                            Administrative Portal
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
