"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2, Shield, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserTable({ users }: { users: any[] }) {
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const handleRoleUpdate = async (userId: string, newRole: "student" | "moderator" | "admin") => {
        setLoadingIds(prev => [...prev, userId]);
        toast.loading(`Updating role to ${newRole}...`);

        const { success, error } = await updateUserRole(userId, newRole);

        toast.dismiss();
        setLoadingIds(prev => prev.filter(id => id !== userId));

        if (success) {
            toast.success("Role updated successfully");
        } else {
            toast.error(error || "Failed to update role");
        }
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[300px]">User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="group transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <div className="font-semibold text-foreground truncate">{user.email}</div>
                                        <div className="text-[10px] font-mono text-muted-foreground truncate opacity-70 group-hover:opacity-100 transition-opacity">
                                            {user.id}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={user.role === 'admin' ? "default" : "secondary"}
                                    className={cn(
                                        "uppercase text-[10px] tracking-wider font-bold",
                                        user.role === 'admin' ? "bg-primary shadow-sm" : "bg-muted"
                                    )}
                                >
                                    {user.role}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                                {new Date(user.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </TableCell>
                            <TableCell className="text-right">
                                {loadingIds.includes(user.id) ? (
                                    <div className="flex justify-end pr-4">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <select
                                        className="h-9 w-full md:w-32 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        value={user.role}
                                        disabled={loadingIds.includes(user.id)}
                                        onChange={(e) => handleRoleUpdate(user.id, e.target.value as any)}
                                    >
                                        <option value="student">Student</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {users.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                                No users found in the system.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
