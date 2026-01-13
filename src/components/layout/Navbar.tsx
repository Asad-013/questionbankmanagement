"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, PlusCircle, LogIn, Menu, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);

        // Check auth status
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                if (profile?.role === "admin") {
                    setIsAdmin(true);
                }
            }
        };
        checkAuth();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/questions", label: "Browse", icon: <Search className="w-4 h-4 mr-1" /> },
        { href: "/upload", label: "Contribute", icon: <PlusCircle className="w-4 h-4 mr-1" /> },
    ];

    if (isAdmin) {
        navLinks.push({ href: "/admin", label: "Admin Panel", icon: <Shield className="w-4 h-4 mr-1" /> });
    }

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.reload();
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-background/80 backdrop-blur-md border-border shadow-sm h-16" : "bg-transparent h-20"
            )}
        >
            <div className="container h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        I
                    </div>
                    <span className="font-bold text-lg tracking-tight">ILET</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <span className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-muted/50 transition-all">
                                {link.icon}
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* Mobile Only Admin Link if hidden on desktop? No, added to navLinks above. */}
                            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button size="sm" variant="secondary" className="hidden md:flex">
                                        Admin
                                    </Button>
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="hidden md:flex">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className={cn("shadow-lg shadow-primary/20", scrolled ? "" : "opacity-90")}>
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
