'use server';

import { revalidatePath } from 'next/cache';
import { getResendClient } from '@/lib/resend';
import { createClient } from '@/lib/supabase/server';

export async function getApplications() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return data || [];
}

export async function updateApplicationStatus(id: string, status: 'approved' | 'rejected') {
  try {
    const supabase = await createClient();

    // 1. Fetch applicant's email and name
    const { data: appData, error: fetchError } = await supabase
      .from('applications')
      .select('email, full_name')
      .eq('id', id)
      .single();

    if (fetchError || !appData) {
      console.error('Error fetching applicant for email:', fetchError);
    }

    // 2. Perform the status update
    const { error: updateError } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating application:', updateError);
      return { success: false, error: 'Failed to update application' };
    }

    // 3. Send notification email to applicant
    if (appData?.email) {
      const resend = getResendClient();
      if (resend) {
        try {
          const isApproved = status === 'approved';
          await resend.emails.send({
            from: 'ILET <onboarding@resend.dev>',
            to: appData.email,
            subject: isApproved 
              ? 'Application Update: You have been approved! - ILET'
              : 'Application Update regarding your ILET application',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
                <h2 style="color: ${isApproved ? '#10b981' : '#3b82f6'};">
                  Hello ${appData.full_name},
                </h2>
                <p>We are writing to provide an update on your application for the Admin/Moderator position at ILET.</p>
                
                <div style="background: #f3f4f6; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #e5e7eb;">
                  <p style="margin: 0; font-size: 16px;">
                    Your application status has been updated to: 
                    <strong style="color: ${isApproved ? '#059669' : '#dc2626'}; text-transform: uppercase;">
                      ${status}
                    </strong>
                  </p>
                </div>

                ${isApproved ? `
                  <p>Congratulations! We were impressed with your application and are excited to have you join our team. We will be in touch shortly via WhatsApp/Email with the next steps for your onboarding.</p>
                  <p>In the meantime, feel free to explore the platform and familiarize yourself with our community guidelines.</p>
                ` : `
                  <p>Thank you for your interest and for taking the time to apply. After careful review, we regret to inform you that we will not be moving forward with your application at this time.</p>
                  <p>We appreciate your interest in ILET and wish you the best in your future endeavors. You are welcome to apply again in the future as our needs evolve.</p>
                `}

                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                <p style="font-size: 14px; color: #6b7280; text-align: center;">
                  Best regards,<br>
                  <strong>The ILET Team</strong>
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Status email error:', emailError);
        }
      }
    }

    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
