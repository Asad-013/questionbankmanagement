import { redirect } from 'next/navigation';
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getApplications } from '@/lib/actions/applications';
import { ApplicationsTable } from '@/components/features/admin/ApplicationsTable';

export const metadata = {
  title: 'Applications - Admin - ILET',
  description: 'View and manage moderator applications',
};

export default async function AdminApplicationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/login');
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('clerk_id', userId)
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
