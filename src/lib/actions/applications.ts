'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

export async function getApplications() {
  const supabase = createAdminClient();

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
    const supabase = createAdminClient();

    const { error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error updating application:', error);
      return { success: false, error: 'Failed to update application' };
    }

    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error) {
    console.error('Error updating application:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
