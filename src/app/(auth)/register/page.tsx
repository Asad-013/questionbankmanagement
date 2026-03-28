"use client";

import Link from "next/link";
import { signup } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ShieldCheck, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
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
                setIsLoading(false);
            } else {
                toast.success("Account created! Check your email to verify your account.");
            }
        } catch (error) {
            console.error("Signup error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground text-sm">
                    Join ILET to access and contribute exam questions.
                </p>
            </div>

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

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                    <p className="text-[11px] text-muted-foreground/70">
                        At least 6 characters.
                    </p>
                </div>

                {showAdminOption && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">I am a</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className={cn(
                                    "cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all",
                                    role === "student"
                                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                                )}
                                onClick={() => setRole("student")}
                            >
                                <User className="h-5 w-5" />
                                <span className="font-medium text-sm">Student</span>
                            </button>
                            <button
                                type="button"
                                className={cn(
                                    "cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2.5 transition-all",
                                    role === "admin"
                                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                                        : "border-border bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                                )}
                                onClick={() => setRole("admin")}
                            >
                                <ShieldCheck className="h-5 w-5" />
                                <span className="font-medium text-sm">Admin</span>
                            </button>
                        </div>
                    </div>
                )}

                {!showAdminOption && (
                    <input type="hidden" name="role" value="student" />
                )}

                <Button
                    className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                        </>
                    ) : (
                        <>
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
