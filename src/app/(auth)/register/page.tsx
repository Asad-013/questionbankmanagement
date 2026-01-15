"use client";

import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, Lock, ShieldCheck, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<"student" | "admin">("student");

    const showAdminOption = searchParams.get("admin") === "true";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set("role", role);

        try {
            const result = await signup(formData);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Account created! Redirecting...");
            }
        } catch (error) {
            console.error("Signup error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4 group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Home
            </Link>
            <div className="space-y-2 text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Join ILET Archive</h1>
                <p className="text-muted-foreground">
                    Register with your institutional email to download and contribute questions. Let's save everyone's time!
                </p>
            </div>

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
                            className="h-11 pl-10"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="h-11 pl-10 pr-10"
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

                {showAdminOption ? (
                    <div className="space-y-3">
                        <Label>I am a...</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={cn(
                                    "cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                                    role === "student" ? "border-primary bg-primary/5 text-primary" : "border-muted bg-background text-muted-foreground"
                                )}
                                onClick={() => setRole("student")}
                            >
                                <User className="h-6 w-6" />
                                <span className="font-medium text-sm">Student</span>
                            </div>
                            <div
                                className={cn(
                                    "cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                                    role === "admin" ? "border-primary bg-primary/5 text-primary" : "border-muted bg-background text-muted-foreground"
                                )}
                                onClick={() => setRole("admin")}
                            >
                                <ShieldCheck className="h-6 w-6" />
                                <span className="font-medium text-sm">Admin (Demo)</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <input type="hidden" name="role" value="student" />
                )}

                <Button className="w-full h-12 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                        </>
                    ) : (
                        "Get Started"
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
