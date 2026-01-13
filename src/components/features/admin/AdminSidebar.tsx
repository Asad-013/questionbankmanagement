"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, FileText, CheckSquare, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

export function AdminSidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + "/");
    };

    return (
        <aside className="w-64 border-r bg-muted/30 hidden md:flex md:flex-col h-screen sticky top-0">
            <div className="p-6">
                <Link href="/"><h2 className="text-lg font-bold tracking-tight text-primary cursor-pointer">ILET Admin</h2></Link>
            </div>
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <Link href="/admin">
                    <Button
                        variant={pathname === "/admin" ? "secondary" : "ghost"}
                        className={cn("w-full justify-start transition-colors", pathname === "/admin" && "bg-secondary/50 font-semibold")}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                </Link>
                <Link href="/admin/moderation">
                    <Button
                        variant={isActive("/admin/moderation") ? "secondary" : "ghost"}
                        className={cn("w-full justify-start transition-colors", isActive("/admin/moderation") && "bg-secondary/50 font-semibold")}
                    >
                        <CheckSquare className="mr-2 h-4 w-4" />
                        Moderation Queue
                    </Button>
                </Link>
                <Link href="/admin/users">
                    <Button
                        variant={isActive("/admin/users") ? "secondary" : "ghost"}
                        className={cn("w-full justify-start transition-colors", isActive("/admin/users") && "bg-secondary/50 font-semibold")}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Users
                    </Button>
                </Link>
                <div className="pt-4 pb-2">
                    <h3 className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Settings</h3>
                </div>
                <Link href="/admin/settings/taxonomy">
                    <Button
                        variant={isActive("/admin/settings/taxonomy") ? "secondary" : "ghost"}
                        className={cn("w-full justify-start transition-colors", isActive("/admin/settings/taxonomy") && "bg-secondary/50 font-semibold")}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Taxonomy Managers
                    </Button>
                </Link>
            </nav>
            <div className="p-4 border-t bg-background/50">
                <form action={logout}>
                    <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </aside>
    );
}
