"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Shield, Users } from "lucide-react";
import { UserDependentCTA } from "./UserDependentContent";

export function HeroContent() {
    return (
        <motion.div
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.3,
                duration: 0.8,
                ease: "easeInOut",
            }}
            className="relative flex flex-col gap-6 items-center justify-center px-4 text-center z-10"
        >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background/50 backdrop-blur-sm mb-2 shadow-sm border-primary/20">
                <GraduationCap className="h-4 w-4 text-primary mr-2" />
                <span className="text-muted-foreground font-medium uppercase tracking-tighter">University of Dhaka • ILET</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight dark:text-white">
                Access The ILET <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Archive Effortlessly.</span>
            </h1>
            
            <p className="text-xl text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto leading-relaxed">
                The central question bank portal for the Institute of Leather Engineering and Technology. Browse and download previous years&apos; papers across all engineering departments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-full max-w-lg">
                <Link href="/register" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 bg-primary text-white hover:bg-primary/90 font-semibold">
                        <Mail className="mr-2 h-5 w-5" />
                        Sign Up Free
                    </Button>
                </Link>
                <UserDependentCTA />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Free forever</span>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>Join 500+ students</span>
                </div>
            </div>
        </motion.div>
    );
}
