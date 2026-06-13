"use server";

import { getResendClient } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const feedbackSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    type: z.enum(["bug", "improvement", "other"]),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
    image: z.string().optional(),
});

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

const feedbackTimestamps = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function checkRateLimit(email: string): boolean {
    const now = Date.now();
    const timestamps = (feedbackTimestamps.get(email) || []).filter(
        (ts) => now - ts < RATE_LIMIT_WINDOW_MS
    );
    if (timestamps.length >= RATE_LIMIT_MAX) return false;
    timestamps.push(now);
    feedbackTimestamps.set(email, timestamps);
    return true;
}

export async function sendFeedback(formData: {
    name: string;
    email: string;
    type: "bug" | "improvement" | "other";
    subject: string;
    message: string;
    image?: string;
}) {
    const parsed = feedbackSchema.safeParse(formData);
    if (!parsed.success) {
        return { success: false, error: "Invalid input data." };
    }

    if (!checkRateLimit(formData.email)) {
        return { success: false, error: "Too many feedback submissions. Please try again later." };
    }

    let imageUrl: string | null = null;

    // 1. If an image attachment is provided (base64), upload it to Supabase Storage
    if (formData.image && formData.image.startsWith("data:image/")) {
        try {
            const mimeType = formData.image.match(/data:([^;]+);/)?.[1] || "image/png";
            const base64Data = formData.image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            
            const ext = mimeType.split("/")[1] || "png";
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`;
            
            const supabaseAdmin = createAdminClient();
            const { error: uploadError } = await supabaseAdmin.storage
                .from("feedback")
                .upload(fileName, buffer, {
                    contentType: mimeType,
                    upsert: false
                });
                
            if (uploadError) {
                console.error("Failed to upload feedback attachment:", uploadError);
            } else {
                const { data: { publicUrl } } = supabaseAdmin.storage
                    .from("feedback")
                    .getPublicUrl(fileName);
                imageUrl = publicUrl;
            }
        } catch (uploadErr) {
            console.error("Error processing feedback image attachment:", uploadErr);
        }
    }

    // 2. Store feedback in the Supabase database
    try {
        const supabase = createAdminClient();
        const { error: dbError } = await supabase
            .from("feedback")
            .insert({
                name: formData.name,
                email: formData.email,
                type: formData.type,
                subject: formData.subject,
                message: formData.message,
                image_url: imageUrl,
            });

        if (dbError) {
            console.error("Database feedback insert failed:", dbError);
            return { success: false, error: "Failed to store feedback in database." };
        }
    } catch (dbErr) {
        console.error("Unexpected database error during feedback submission:", dbErr);
        return { success: false, error: "Database service unavailable." };
    }

    // 3. Try sending email notification via Resend (optional, non-blocking for user success)
    const resend = getResendClient();
    if (!resend) {
        console.warn("Resend client could not be initialized. Feedback stored in database, skipping email.");
        return { success: true };
    }

    try {
        const attachmentHtml = imageUrl 
            ? `<p><strong>Attachment:</strong> <a href="${imageUrl}" target="_blank">View Image</a></p>
               <div style="margin-top: 10px;"><img src="${imageUrl}" alt="Attachment" style="max-width: 100%; max-height: 300px; border-radius: 6px; border: 1px solid #ddd;" /></div>`
            : "";

        const { error: emailError } = await resend.emails.send({
            from: "ILET Archive Feedback <onboarding@resend.dev>",
            to: ["badhona931@gmail.com"],
            subject: `[${escapeHtml(formData.type.toUpperCase())}] ${escapeHtml(formData.subject)}`,
            replyTo: formData.email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #2563eb;">New Feedback Received</h2>
                    <p><strong>From:</strong> ${escapeHtml(formData.name)} (${escapeHtml(formData.email)})</p>
                    <p><strong>Type:</strong> ${escapeHtml(formData.type)}</p>
                    <p><strong>Subject:</strong> ${escapeHtml(formData.subject)}</p>
                    ${attachmentHtml}
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="white-space: pre-wrap;">${escapeHtml(formData.message)}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #666;">This email was sent from the ILET Question Bank Feedback portal.</p>
                </div>
            `,
        });

        if (emailError) {
            console.error("Resend Email Notification Error:", emailError);
        }
    } catch (err) {
        console.error("Feedback email notification failed:", err);
    }

    return { success: true };
}

