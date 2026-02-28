import { getAllUsers } from "@/lib/actions/admin";
import { UserTable } from "@/components/features/admin/UserTable";
import { AddModeratorDialog } from "@/components/features/admin/AddModeratorDialog";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
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
