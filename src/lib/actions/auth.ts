"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["student", "admin"]).optional(), // Simplified for demo
});

export async function login(formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid inputs" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/");
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
                role: parsed.data.role || "student",
            }
        }
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "Password reset link sent to your email!" };
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/login?message=Password updated successfully");
}
