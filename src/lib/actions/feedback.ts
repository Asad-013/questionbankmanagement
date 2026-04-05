"use server";

import { getResendClient } from "@/lib/resend";
import { z } from "zod";

const feedbackSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    type: z.enum(["bug", "improvement", "other"]),
    subject: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
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
}) {
    const resend = getResendClient();
    if (!resend) {
        console.error("Resend client could not be initialized (likely missing API key)");
        return { success: false, error: "Email service not configured." };
    }

    const parsed = feedbackSchema.safeParse(formData);
    if (!parsed.success) {
        return { success: false, error: "Invalid input data." };
    }

    if (!checkRateLimit(formData.email)) {
        return { success: false, error: "Too many feedback submissions. Please try again later." };
    }

    try {
        const { data, error } = await resend.emails.send({
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
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="white-space: pre-wrap;">${escapeHtml(formData.message)}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #666;">This email was sent from the ILET Question Bank Feedback portal.</p>
                </div>
            `,
        });

        if (error) {
            console.error("Resend Error:", error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Feedback submission failed:", err);
        return { success: false, error: "Failed to send feedback. Please try again later." };
    }
}
