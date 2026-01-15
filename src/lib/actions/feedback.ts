"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFeedback(formData: {
    name: string;
    email: string;
    type: "bug" | "improvement" | "other";
    subject: string;
    message: string;
}) {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not set");
        return { success: false, error: "Email service not configured." };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: "ILET Archive Feedback <onboarding@resend.dev>",
            to: ["badhona931@gmail.com"],
            subject: `[${formData.type.toUpperCase()}] ${formData.subject}`,
            replyTo: formData.email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #2563eb;">New Feedback Received</h2>
                    <p><strong>From:</strong> ${formData.name} (${formData.email})</p>
                    <p><strong>Type:</strong> ${formData.type}</p>
                    <p><strong>Subject:</strong> ${formData.subject}</p>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="white-space: pre-wrap;">${formData.message}</p>
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
