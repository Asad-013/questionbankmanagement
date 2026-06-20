"use client";

import Link from "next/link";
import { resetPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const searchParams = useSearchParams();

    const errorCode = searchParams.get("error_code");
    const errorMsg = searchParams.get("error_description") || searchParams.get("error");
    const isLinkInvalid = errorCode === "otp_expired" || !!searchParams.get("error");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const form = e.currentTarget;
        const formData = new FormData();
        formData.set("password", (form.elements.namedItem("password") as HTMLInputElement).value);
        formData.set("confirmPassword", (form.elements.namedItem("confirmPassword") as HTMLInputElement).value);

        try {
            const result = await resetPassword(formData);
            if (result?.error) {
                toast.error(result.error);
                setIsLoading(false);
            } else if (result?.success) {
                toast.success("Password reset successfully!");
                window.location.href = "/login?msg=password-updated";
            }
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    if (isLinkInvalid) {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight text-red-500 flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 shrink-0" />
                        Link Expired or Invalid
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        This password reset link is no longer valid. Password reset links expire after a short time or can only be used once.
                    </p>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                    {errorMsg ? decodeURIComponent(errorMsg.replace(/\+/g, " ")) : "The authentication code or token is invalid or expired."}
                </div>

                <Button asChild className="w-full h-11 rounded-xl font-medium shadow-lg shadow-primary/20">
                    <Link href="/forgot-password">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Request New Reset Link
                    </Link>
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Back to{" "}
                    <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Set new password</h1>
                <p className="text-muted-foreground text-sm">
                    Choose a strong password for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">New password</Label>
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

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            required
                            className="h-11 pl-10 pr-10 rounded-xl"
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
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                        </>
                    ) : (
                        <>
                            Update Password
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );
}
