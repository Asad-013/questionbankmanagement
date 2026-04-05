'use server';

import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitApplication(formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const address = formData.get('address') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const university = formData.get('university') as string;
    const department = formData.get('department') as string;
    const session = formData.get('session') as string;
    const idCard = formData.get('idCard') as File;

    if (!fullName || !address || !whatsapp || !university || !department || !session || !idCard) {
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
      await resend.emails.send({
        from: 'ILET Applications <noreply@ilet.com>',
        to: 'badhona931@gmail.com',
        subject: `New Application: ${fullName} wants to join as Admin/Moderator`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3b82f6;">New Application Received</h2>
            <p>A new application has been submitted for Admin/Moderator position.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Applicant Details</h3>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>WhatsApp:</strong> ${whatsapp}</p>
              <p><strong>University:</strong> ${university}</p>
              <p><strong>Department:</strong> ${department}</p>
              <p><strong>Session:</strong> ${session}</p>
            </div>
            
            <p>
              <strong>University ID Card:</strong><br>
              <a href="${idCardUrl}" style="color: #3b82f6;">View ID Card</a>
            </p>
            
            <p style="color: #6b7280; font-size: 12px;">
              View all applications at: <a href="https://ilet.vercel.app/admin/applications">Admin Panel</a>
            </p>
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
