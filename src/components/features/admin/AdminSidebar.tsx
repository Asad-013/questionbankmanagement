"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, FileText, CheckSquare, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

const navItems = [
    { href: "/admin", label: "Admin Overview", icon: LayoutDashboard },
    { href: "/admin/content", label: "Question Archive", icon: FileText },
    { href: "/admin/moderation", label: "Pending Reviews", icon: CheckSquare },
    { href: "/admin/users", label: "Member Directory", icon: Users },
    { href: "/admin/settings/taxonomy", label: "Academic Setup", icon: Settings },
];

export function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + "/");
    };

    return (
        <aside className={cn("w-64 border-r bg-muted/30 flex flex-col h-full", className)}>
            <div className="p-6">
                <Link href="/"><h2 className="text-lg font-bold tracking-tight text-primary cursor-pointer leading-tight underline underline-offset-4 decoration-primary/30">ILET DU Admin</h2></Link>
            </div>
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={isActive(item.href) ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start transition-colors",
                                isActive(item.href) && "bg-secondary/50 font-semibold"
                            )}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
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
