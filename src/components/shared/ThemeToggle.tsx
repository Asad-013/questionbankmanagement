"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className={cn("h-9 w-24 rounded-lg bg-muted animate-pulse", className)} />
        );
    }

    const themes = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "system", icon: Monitor, label: "System" },
        { value: "dark", icon: Moon, label: "Dark" },
    ];

    return (
        <div className={cn("flex items-center rounded-lg border border-border/60 bg-background/80 backdrop-blur-sm p-0.5 shadow-sm", className)}>
            {themes.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200",
                        theme === value
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    )}
                >
                    <Icon className="h-3.5 w-3.5 transition-transform duration-200" />
                </button>
            ))}
        </div>
    );
}

export function ThemeToggleIcon({ className }: { className?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return <div className={cn("h-9 w-9 rounded-lg bg-muted animate-pulse", className)} />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/80 backdrop-blur-sm transition-all duration-200 hover:bg-muted hover:shadow-sm",
                className
            )}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-muted-foreground" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-muted-foreground" />
        </button>
    );
}
