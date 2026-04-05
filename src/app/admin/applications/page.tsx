import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getApplications } from '@/lib/actions/applications';
import { ApplicationsTable } from '@/components/features/admin/ApplicationsTable';

export const metadata = {
  title: 'Applications - Admin - ILET',
  description: 'View and manage moderator applications',
};

export default async function AdminApplicationsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/');
  }

  const applications = await getApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground">
          Review applications to join as Admin or Moderator
        </p>
      </div>

      <ApplicationsTable applications={applications} />
    </div>
  );
}
