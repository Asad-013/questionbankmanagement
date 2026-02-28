"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, PlusCircle, LogIn, Menu, Shield, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);

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
                    .select("role, full_name, email, avatar_url")
                    .eq("id", user.id)
                    .single();

                setUserProfile(profile);

                if (profile?.role === "admin") {
                    setIsAdmin(true);
                } else if (profile?.role === "moderator") {
                    setIsModerator(true);
                    setIsAdmin(true); // Treat as admin for conditional UI rendering
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
        navLinks.push({
            href: isModerator ? "/moderator" : "/admin",
            label: isModerator ? "Moderator Panel" : "Admin Panel",
            icon: <Shield className="w-4 h-4 mr-1" />
        });
    }

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.reload();
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-background/95 backdrop-blur-md border-border shadow-sm h-16"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        DU
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-lg tracking-tight">ILET</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Question Bank</span>
                    </div>
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
                            <Link href="/notifications">
                                <Button variant="ghost" size="icon" className="relative group">
                                    <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <span className="absolute top-1 right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                </Button>
                            </Link>
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" className="font-medium text-foreground relative h-8 rounded-full pr-3 pl-1 object-cover">
                                    {userProfile?.avatar_url ? (
                                        <img
                                            src={userProfile.avatar_url}
                                            alt="Profile"
                                            className="h-6 w-6 rounded-full object-cover mr-2"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-2 text-xs">
                                            {userProfile?.full_name ? userProfile.full_name[0].toUpperCase() : userProfile?.email?.[0].toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <span className="hidden md:flex">
                                        {userProfile?.full_name?.split(' ')[0] || "Profile"}
                                    </span>
                                </Button>
                            </Link>

                            <Button variant="ghost" size="sm" onClick={handleSignOut}>
                                Sign Out
                            </Button>
                            {isAdmin && (
                                <Link href={isModerator ? "/moderator" : "/admin"}>
                                    <Button size="sm" variant="secondary" className="hidden md:flex">
                                        {isModerator ? "Moderator" : "Admin"}
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
