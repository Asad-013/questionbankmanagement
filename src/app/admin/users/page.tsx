import { getAllUsers } from "@/lib/actions/admin";
import { UserTable } from "@/components/features/admin/UserTable";
import { AddModeratorDialog } from "@/components/features/admin/AddModeratorDialog";

import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const { userId } = await auth();
    if (!userId) redirect("/login");

    const supabase = createAdminClient();
    const { data: profile } = await supabase.from("users").select("role").eq("clerk_id", userId).single();
    if (profile?.role !== "admin") redirect("/admin");

    const users = await getAllUsers();

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Member Directory</h2>
                    <p className="text-muted-foreground">Manage ILET community members and their access levels.</p>
                </div>
                <AddModeratorDialog />
            </div>
            <UserTable users={users || []} />
        </div>
    );
}
