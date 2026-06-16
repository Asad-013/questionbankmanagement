'use server';

import { revalidatePath } from 'next/cache';
import { getResendClient } from '@/lib/resend';
import { createAdminClient } from '@/lib/supabase/admin';

// ─────────────────────────────────────────────────────────────────────────────
// SECURITY FIX (VULN-08): Server-side file type validation via magic bytes.
// Previously, the MIME type was taken directly from the client-controlled
// FormData, which allows uploading arbitrary files (SVG XSS, HTML, executables)
// with a forged content type of "image/jpeg".
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_ID_CARD_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_ID_CARD_SIZE = 5 * 1024 * 1024; // 5MB

/** Detect real MIME type from file magic bytes — not from client-provided metadata */
function detectMimeType(buffer: Buffer): string {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return 'image/jpeg';
    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'image/png';
    // RIFF (WebP starts with RIFF....WEBP)
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46
        && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) return 'image/webp';
    // PDF: %PDF
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) return 'application/pdf';
    return 'application/octet-stream'; // Unknown / not allowed
}

function getExtension(mimeType: string): string {
    const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'application/pdf': 'pdf',
    };
    return map[mimeType] ?? 'bin';
}

export async function submitApplication(formData: FormData) {
    try {
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const address = formData.get('address') as string;
        const whatsapp = formData.get('whatsapp') as string;
        const university = formData.get('university') as string;
        const department = formData.get('department') as string;
        const session = formData.get('session') as string;
        const idCard = formData.get('idCard') as File;

        if (!fullName || !email || !address || !whatsapp || !university || !department || !session || !idCard) {
            return { success: false, error: 'All fields are required' };
        }

        // ✅ SECURITY FIX: Validate file size on the server
        if (!idCard || idCard.size === 0) {
            return { success: false, error: 'ID card file is required' };
        }

        if (idCard.size > MAX_ID_CARD_SIZE) {
            return { success: false, error: 'ID card file too large. Maximum size is 5MB.' };
        }

        // ✅ SECURITY FIX: Read actual file bytes and detect real MIME type
        const fileBuffer = Buffer.from(await idCard.arrayBuffer());
        const detectedMimeType = detectMimeType(fileBuffer);

        if (!ALLOWED_ID_CARD_TYPES.includes(detectedMimeType)) {
            return {
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, WebP images and PDF documents are allowed.'
            };
        }

        const supabase = createAdminClient();

        // Use server-detected extension and MIME type — never trust the client
        const ext = getExtension(detectedMimeType);
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('id-cards')
            .upload(fileName, fileBuffer, {
                contentType: detectedMimeType, // ✅ Use server-detected type, not client-provided
                upsert: false,
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            return { success: false, error: 'Failed to upload ID card' };
        }

        const { data: urlData } = supabase.storage
            .from('id-cards')
            .getPublicUrl(fileName);

        const idCardUrl = urlData.publicUrl;

        const { error: dbError } = await supabase
            .from('applications')
            .insert({
                full_name: fullName,
                email: email,
                address: address,
                whatsapp: whatsapp,
                university: university,
                department: department,
                session: session,
                id_card_url: idCardUrl,
                status: 'pending',
            });

        if (dbError) {
            console.error('Database error:', dbError);
            return { success: false, error: 'Failed to save application' };
        }

        const resend = getResendClient();
        if (resend) {
            try {
                // 1. Send notification to Admin
                await resend.emails.send({
                    from: 'ILET <onboarding@resend.dev>',
                    to: 'badhona931@gmail.com',
                    subject: `New Application: ${fullName}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px;">
                            <h2 style="color: #3b82f6;">New Application Received</h2>
                            <p>A new application has been submitted for Admin/Moderator position.</p>
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <p><strong>Name:</strong> ${fullName}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>WhatsApp:</strong> ${whatsapp}</p>
                                <p><strong>University:</strong> ${university}</p>
                                <p><strong>Department:</strong> ${department}</p>
                            </div>
                            <p><a href="${idCardUrl}">View ID Card</a></p>
                        </div>
                    `,
                });

                // 2. Send confirmation to Applicant
                await resend.emails.send({
                    from: 'ILET <onboarding@resend.dev>',
                    to: email,
                    subject: 'We have received your application - ILET',
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
                            <h2 style="color: #3b82f6;">Hello ${fullName},</h2>
                            <p>Thank you for your interest in joining ILET as an Admin/Moderator!</p>
                            <p>We have successfully received your application. Our team will review your details and the provided ID card. We will get back to you via email or WhatsApp if your application is shortlisted.</p>
                            
                            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0; font-size: 16px;">Application Summary:</h3>
                                <ul style="list-style: none; padding: 0;">
                                    <li><strong>Position:</strong> Admin/Moderator</li>
                                    <li><strong>Status:</strong> Pending Review</li>
                                </ul>
                            </div>

                            <p>Please do not reply to this automated email. If you have any urgent queries, feel free to contact us through our official channels.</p>
                            
                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                            <p style="font-size: 14px; color: #6b7280;">Best regards,<br>The ILET Team</p>
                        </div>
                    `,
                });
            } catch (emailError) {
                console.error('Email error:', emailError);
            }
        }

        revalidatePath('/admin/applications');

        return { success: true };
    } catch (error) {
        console.error('Application submission error:', error);
        return { success: false, error: 'An unexpected error occurred' };
    }
}
