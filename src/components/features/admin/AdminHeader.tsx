"use client";

import { Menu, X, Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "./AdminSidebar";
import { motion, AnimatePresence } from "framer-motion";

export function AdminHeader({ userEmail }: { userEmail: string }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="h-16 border-b flex items-center px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur z-50 justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-bold text-lg hidden md:block">Dashboard</h1>
                    <h1 className="font-bold text-lg md:hidden">ILET</h1>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button variant="ghost" size="icon" className="text-muted-foreground relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
                    </Button>
                    <div className="flex items-center gap-3 pl-2 border-l ml-2">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium leading-none">Admin User</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{userEmail}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                            AD
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-card z-[70] md:hidden shadow-2xl"
                        >
                            <div className="absolute right-4 top-4">
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <AdminSidebar className="w-full border-none" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
