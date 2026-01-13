"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Wait, I might not have Table component yet. 
// I'll check or generic HTML table if needed. Actually shadcn Table is standard. 
// Let's assume I need to generate it or use standard HTML for speed if not present.
// I'll check my shadcn components list. 
// I recalled `button`, `input`, `badge`, `card`, `label`, `sonner`. 
// I DON'T have `table`. I should create it first for "Premium" look.

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2, Shield, User } from "lucide-react";

export function UserTable({ users }: { users: any[] }) {
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const handleRoleUpdate = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'student' : 'admin'; // Simple toggle for now

        // Optimistic UI could be tricky if it fails, so we'll use loading state
        setLoadingIds(prev => [...prev, userId]);
        toast.loading(`Updating role to ${newRole}...`);

        const { success, error } = await updateUserRole(userId, newRole);

        toast.dismiss();
        setLoadingIds(prev => prev.filter(id => id !== userId));

        if (success) {
            toast.success("Role updated successfully");
            // Server action revalidates, but we might want local state update to avoid flicker? 
            // Next.js router refresh handles it.
        } else {
            toast.error(error || "Failed to update role");
        }
    };

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-foreground">{user.email}</div>
                                        <div className="text-xs text-muted-foreground">{user.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td className="p-4 text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={loadingIds.includes(user.id)}
                                    onClick={() => handleRoleUpdate(user.id, user.role)}
                                >
                                    {loadingIds.includes(user.id) ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <Shield className="h-3 w-3 mr-2" />
                                    )}
                                    {user.role === 'admin' ? "Demote" : "Promote"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
