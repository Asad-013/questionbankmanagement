"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { useUser } from "./WelcomeBanner";

export function UserDependentCTA() {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-neutral-200 dark:border-white/20 hover:bg-background/80 transition-all hover:scale-105">
                    Join Archive
                </Button>
            </Link>
        );
    }

    if (user) {
        return (
            <Link href="/upload">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-neutral-200 dark:border-white/20 hover:bg-background/80 transition-all hover:scale-105">
                    Contribute Now
                </Button>
            </Link>
        );
    }

    return (
        <Link href="/register">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-neutral-200 dark:border-white/20 hover:bg-background/80 transition-all hover:scale-105">
                Join Archive
            </Button>
        </Link>
    );
}

export function UserDependentText() {
    const { user, loading } = useUser();

    if (loading) {
        return null;
    }

    return (
        <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
                {user ? "Ready to keep helping?" : "Ready to simplify your study life?"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                {user
                    ? "Continue contributing to the archive and help your fellow students succeed."
                    : "Join the ILET community archive. Access resources, upload papers, and keep student life efficient."}
            </p>
            <Link href={user ? "/questions" : "/register"}>
                <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 hover:scale-105 transition-transform bg-primary text-white">
                    {user ? "Enter Archive" : "Register with Institutional Email"}
                </Button>
            </Link>
        </div>
    );
}
