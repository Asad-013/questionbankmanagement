"use client";
import React, { useState } from "react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ThemeToggleIcon } from "@/components/shared/ThemeToggle";
import { useUser } from "@clerk/nextjs";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: React.ReactNode;
    }[];
    className?: string;
}) => {
    const { scrollYProgress } = useScroll();

    const { user, isLoaded } = useUser();
    const [visible, setVisible] = useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isModerator, setIsModerator] = React.useState(false);

    React.useEffect(() => {
        if (!isLoaded) return;
        if (user) {
            fetch("/api/me")
                .then((r) => r.json())
                .then((profile) => {
                    if (profile?.role === "admin") {
                        setIsAdmin(true);
                        setIsModerator(false);
                    } else if (profile?.role === "moderator") {
                        setIsAdmin(true);
                        setIsModerator(true);
                    } else {
                        setIsAdmin(false);
                        setIsModerator(false);
                    }
                })
                .catch(() => {
                    setIsAdmin(false);
                    setIsModerator(false);
                });
        } else {
            setIsAdmin(false);
            setIsModerator(false);
        }
    }, [user, isLoaded]);

    useMotionValueEvent(scrollYProgress, "change", (current) => {
        // ...Direction checking logic...
        if (typeof current === "number") {
            let direction = current! - scrollYProgress.getPrevious()!;
            if (scrollYProgress.get() < 0.05) {
                setVisible(true);
            } else {
                setVisible(direction < 0);
            }
        }
    });

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 1, y: -100 }}
                animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                    "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-white/[0.1] dark:border-white/[0.2] rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-2xl z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4 transition-all duration-300",
                    className
                )}
            >
                {navItems.map((navItem: any, idx: number) => (
                    <Link
                        key={`link=${navItem.link}`}
                        href={navItem.link}
                        className={cn(
                            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
                        )}
                    >
                        <span className="block sm:hidden">{navItem.icon}</span>
                        <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
                    </Link>
                ))}

                {(isAdmin || isModerator) && (
                    <Link
                        href={isModerator ? "/moderator" : "/admin"}
                        className="relative dark:text-neutral-50 items-center flex space-x-1 text-primary hover:text-primary/80 transition-colors"
                    >
                        <span className="hidden sm:block text-sm font-bold">Admin</span>
                    </Link>
                )}

                <div className="flex items-center gap-2 pr-2">
                    <ThemeToggleIcon className="h-8 w-8 !border-none !bg-transparent !shadow-none" />
                    {user ? (
                        <Link
                            href="/questions"
                            className="border text-sm font-bold relative border-primary/20 bg-primary/10 text-primary px-5 py-2 rounded-full transition-all hover:bg-primary/20"
                        >
                            <span>Archive</span>
                            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-primary to-transparent h-px" />
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="border text-sm font-bold relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-5 py-2 rounded-full transition-all hover:bg-neutral-100 dark:hover:bg-white/10"
                        >
                            <span>Login</span>
                            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
                        </Link>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

