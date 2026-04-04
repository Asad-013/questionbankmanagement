"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Search, PlusCircle, Menu, Shield, Bell, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggleIcon } from "@/components/shared/ThemeToggle";

export function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModerator, setIsModerator] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);

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
                    setIsAdmin(true);
                }
            }
        };
        checkAuth();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: "/questions", label: "Browse", icon: <Search className="w-4 h-4 mr-1" /> },
        { href: "/upload", label: "Contribute", icon: <PlusCircle className="w-4 h-4 mr-1" /> },
    ];

    // Admin/Moderator dashboard is now shown as a prominent button in the action bar (right side)
    /*
    if (isAdmin) {
        navLinks.push({
            href: isModerator ? "/moderator" : "/admin",
            label: isModerator ? "Moderator Panel" : "Admin Panel",
            icon: <Shield className="h-4 w-4 mr-1" />
        });
    }
    */

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.reload();
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-background/80 backdrop-blur-xl h-16",
                scrolled ? "border-border shadow-sm" : "border-transparent"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="h-9 w-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        I
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-bold text-lg tracking-tight">ILET</span>
                        <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-[0.15em]">Question Bank</span>
                    </div>
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center text-sm font-medium transition-all px-3 py-2 rounded-lg hover:bg-muted/60",
                                pathname === link.href
                                    ? "text-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggleIcon className="flex" />

                    {user ? (
                        <>
                            <Link href="/notifications">
                                <Button variant="ghost" size="icon" className="relative group h-9 w-9 rounded-lg">
                                    <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                </Button>
                            </Link>
                            <Link href="/profile">
                                <Button variant="ghost" size="sm" className="font-medium text-foreground relative h-9 rounded-lg pr-3 pl-1.5 gap-2">
                                    {userProfile?.avatar_url ? (
                                        <img
                                            src={userProfile.avatar_url}
                                            alt="Profile"
                                            className="h-6 w-6 rounded-md object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="h-6 w-6 rounded-md bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">
                                            {userProfile?.full_name ? userProfile.full_name[0].toUpperCase() : userProfile?.email?.[0].toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <span className="hidden md:inline">
                                        {userProfile?.full_name?.split(' ')[0] || "Profile"}
                                    </span>
                                </Button>
                            </Link>

                            {(isAdmin || isModerator) && (
                                <Link href={isModerator ? "/moderator" : "/admin"} className="hidden md:block">
                                    <Button variant="outline" size="sm" className="h-9 rounded-lg border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary-foreground transition-all">
                                        <Shield className="mr-2 h-3.5 w-3.5" />
                                        {isModerator ? "Moderator Panel" : "Admin Panel"}
                                    </Button>
                                </Link>
                            )}

                            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden md:flex">
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:block">
                                <Button variant="ghost" size="sm" className="rounded-lg">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className={cn("rounded-lg shadow-lg shadow-primary/20")}>
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden h-9 w-9 rounded-lg"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                    pathname === link.href
                                        ? "text-primary bg-primary/5"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-3 border-t mt-3 flex items-center justify-between px-4 pb-2">
                            <span className="text-sm text-muted-foreground">Theme</span>
                            <ThemeToggleIcon />
                        </div>
                        {user && (
                            <>
                                {(isAdmin || isModerator) && (
                                    <Link
                                        href={isModerator ? "/moderator" : "/admin"}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-all w-full"
                                    >
                                        <Shield className="h-4 w-4" />
                                        {isModerator ? "Moderator Panel" : "Admin Panel"}
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-all w-full"
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
