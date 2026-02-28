import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AuditLogsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        redirect("/");
    }

    const { data: logs, error } = await supabase
        .from("audit_logs")
        .select(`
            *,
            performer:users!performed_by(email)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                <p className="text-muted-foreground">
                    Review administrative and moderation actions taken across the platform. (Last 100 entries)
                </p>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Time</TableHead>
                            <TableHead>Performer</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs && logs.map((log) => (
                            <TableRow key={log.id} className="group transition-colors">
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                    {new Date(log.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {log.performer?.email || "Unknown"}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-mono text-[10px] uppercase">
                                        {log.action}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs capitalize">{log.entity_type}</span>
                                </TableCell>
                                <TableCell className="text-xs font-mono text-muted-foreground break-all">
                                    {JSON.stringify(log.details)}
                                </TableCell>
                            </TableRow>
                        ))}
                        {(!logs || logs.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
