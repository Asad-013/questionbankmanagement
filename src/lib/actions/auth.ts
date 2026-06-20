"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

// SECURITY FIX (VULN-07): Normalized error messages to prevent account enumeration.
// Previously, raw Supabase errors were returned, revealing whether an email
// is registered ("User already registered"), has verified email, etc.

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid email or password" }; // Generic — don't reveal validation specifics
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
    });

    if (error) {
        // SECURITY FIX: Never return the raw Supabase error message.
        // Supabase distinguishes "Invalid login credentials" from "Email not confirmed"
        // which enables account enumeration. Always return a single generic message.
        return { error: "Invalid email or password" };
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid inputs" };
    }

    const { error, data: authData } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: {
                role: "student",
            }
        }
    });

    if (error) {
        console.error("Supabase signup error detail:", error);
        // SECURITY FIX: Never return the raw Supabase error.
        // Supabase returns "User already registered" which confirms an email exists.
        return { error: "Unable to create account. Please try again later." };
    }

    if (authData.user && authData.session) {
        // User was auto-confirmed (no email verification required in Supabase settings).
        // Create the public profile if session exists.
        const { error: profileError } = await supabase.from('users').insert({
            id: authData.user.id,
            email: authData.user.email as string,
            role: "student",
        });

        if (profileError) {
            console.error("Failed to create user profile in public.users:", profileError);
        }

        revalidatePath("/", "layout");
        return { success: true };
    }

    // Email confirmation required — don't log the user in yet
    return {
        success: "Please check your email to confirm your account before signing in."
    };
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();

    const emailSchema = z.string().email();
    const emailResult = emailSchema.safeParse(formData.get("email"));

    if (!emailResult.success) {
        return { error: "Please enter a valid email address" };
    }

    // SECURITY FIX (VULN-07): Always return success regardless of whether the
    // email exists. This prevents email enumeration — an attacker cannot use
    // error/success differences to confirm whether an email is registered.
    await supabase.auth.resetPasswordForEmail(emailResult.data, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    });

    return {
        success: "If an account exists for this email, a password reset link has been sent."
    };
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        return { error: "Password must be at least 8 characters with one uppercase, one lowercase, and one number" };
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { error: "Failed to update password. Your reset link may have expired." };
    }

    // SECURITY FIX (VULN-12): Use a whitelist key instead of free-text in the URL.
    // Previously: redirect("/login?message=Password updated successfully")
    // An attacker could craft: /login?message=Your+account+is+blocked.+Enter+credentials+here
    return { success: true };
}
