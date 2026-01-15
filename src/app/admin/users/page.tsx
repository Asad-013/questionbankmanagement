import { getAllUsers } from "@/lib/actions/admin";
import { UserTable } from "@/components/features/admin/UserTable";

export default async function UsersPage() {
    const users = await getAllUsers();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Member Directory</h2>
                <p className="text-muted-foreground">Manage ILET community members and their access levels.</p>
            </div>
            <UserTable users={users || []} />
        </div>
    );
}
