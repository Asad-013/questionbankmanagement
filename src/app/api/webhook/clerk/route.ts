import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        console.error("CLERK_WEBHOOK_SECRET is not set in .env");
        return new Response("Webhook secret not configured", { status: 500 });
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Clerk webhook verification failed:", err);
        return new Response("Invalid webhook signature", { status: 400 });
    }

    // -----------------------------------------------------------------------
    // user.created — sync new Clerk users into public.users
    // -----------------------------------------------------------------------
    if (evt.type === "user.created") {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
            return new Response("No email found on user", { status: 400 });
        }

        const supabase = createAdminClient();

        // Check if a user with this email already exists (e.g., migrated from Supabase Auth)
        const { data: existing } = await supabase
            .from("users")
            .select("id")
            .eq("email", email.toLowerCase())
            .single();

        if (existing) {
            // Attach clerk_id to the existing record
            await supabase
                .from("users")
                .update({ clerk_id: id })
                .eq("id", existing.id);
        } else {
            // Create a fresh record
            const { error } = await supabase.from("users").insert({
                clerk_id: id,
                email: email.toLowerCase(),
                role: "student",
                full_name: [first_name, last_name].filter(Boolean).join(" ") || null,
            });

            if (error) {
                console.error("Error inserting user into Supabase:", error);
                return new Response("Failed to create user record", { status: 500 });
            }
        }
    }

    // -----------------------------------------------------------------------
    // user.updated — sync profile changes (name, primary email)
    // -----------------------------------------------------------------------
    if (evt.type === "user.updated") {
        const { id, email_addresses, first_name, last_name } = evt.data;
        const email = email_addresses[0]?.email_address;

        const supabase = createAdminClient();
        await supabase
            .from("users")
            .update({
                email: email?.toLowerCase(),
                full_name: [first_name, last_name].filter(Boolean).join(" ") || null,
            })
            .eq("clerk_id", id);
    }

    return new Response("", { status: 200 });
}
