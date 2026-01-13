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
    });

    if (error) {
        return { error: error.message };
    }

    // Create user profile record
    if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert({
            id: authData.user.id,
            email: parsed.data.email,
            role: parsed.data.role || "student",
            email_verified: false,
        });

        if (profileError) {
            console.error("Profile creation failed:", profileError);
            // Clean up auth user if profile fails? 
            // For now, just logging it. Supabase might just need triggers or manual logic.
        }
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
