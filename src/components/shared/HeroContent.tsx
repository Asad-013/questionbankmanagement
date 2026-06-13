"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Shield, Zap, BookOpen, Search } from "lucide-react";

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
                <Link href="#question-bank" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base rounded-xl shadow-xl shadow-primary/20 transition-all hover:scale-105 bg-primary text-white hover:bg-primary/90 font-semibold">
                        <Search className="mr-2 h-5 w-5" />
                        Browse Questions
                    </Button>
                </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 max-w-3xl">
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-background/60 backdrop-blur-sm border px-3 py-1.5 rounded-full text-muted-foreground shadow-sm">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    <span>Fully Secured Platform</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-background/60 backdrop-blur-sm border px-3 py-1.5 rounded-full text-muted-foreground shadow-sm">
                    <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                    <span>Built for Students</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-background/60 backdrop-blur-sm border px-3 py-1.5 rounded-full text-muted-foreground shadow-sm">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>Fast & Reliable Access</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-background/60 backdrop-blur-sm border px-3 py-1.5 rounded-full text-muted-foreground shadow-sm">
                    <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                    <span>Exam-Focused Resources</span>
                </div>
            </div>
        </motion.div>
    );
}

