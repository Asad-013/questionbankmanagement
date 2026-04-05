'use server';

import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const supabase = createAdminClient();

    const fileBuffer = await idCard.arrayBuffer();
    const fileName = `${Date.now()}-${idCard.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('id-cards')
      .upload(fileName, fileBuffer, {
        contentType: idCard.type,
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

    const { data: application, error: dbError } = await supabase
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
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return { success: false, error: 'Failed to save application' };
    }

    try {
      // 1. Send notification to Admin
      await resend.emails.send({
        from: 'ILET <noreply@ilet.com>',
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
        from: 'ILET <noreply@ilet.com>',
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

    revalidatePath('/admin/applications');

    return { success: true };
  } catch (error) {
    console.error('Application submission error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
