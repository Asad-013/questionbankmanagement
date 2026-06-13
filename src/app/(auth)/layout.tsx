"use client";

import Link from "next/link";
import { ThemeToggleIcon } from "@/components/shared/ThemeToggle";
import { usePathname } from "next/navigation";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isRegisterPage = pathname === "/register";

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Visual Panel */}
            <div className="hidden lg:flex w-[480px] xl:w-[520px] flex-col justify-between relative overflow-hidden bg-primary shrink-0">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/20 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 translate-x-1/3 translate-y-1/3 blur-3xl" />
                </div>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10 p-10">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="h-10 w-10 bg-white text-primary rounded-xl flex items-center justify-center font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
                            I
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-bold text-lg tracking-tight text-white">ILET</span>
                            <span className="text-[9px] text-white/60 font-medium uppercase tracking-[0.15em]">Question Bank</span>
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 px-10 flex-1 flex items-center">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-8 rounded-full bg-white/40" />
                                <span className="text-white/60 text-xs font-medium uppercase tracking-widest">ILET Archive</span>
                            </div>
                            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight">
                                Your gateway to<br />
                                exam excellence.
                            </h2>
                            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                                Access hundreds of past exam papers from the Institute of Leather Engineering and Technology, University of Dhaka.
                            </p>
                        </div>

                        {!isRegisterPage && (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                {[
                                    { label: "Papers", value: "500+" },
                                    { label: "Courses", value: "40+" },
                                    { label: "Users", value: "2K+" },
                                    { label: "Years", value: "10+" },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                                        <div className="text-xl font-bold text-white">{stat.value}</div>
                                        <div className="text-[11px] text-white/50 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 p-10">
                    <blockquote className="border-l-2 border-white/20 pl-4">
                        <p className="text-white/70 text-sm italic leading-relaxed">
                            &ldquo;The foundation of every state is the education of its youth.&rdquo;
                        </p>
                        <footer className="text-white/40 text-xs mt-2">— Diogenes</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col min-h-screen bg-background">
                {/* Top bar with theme toggle */}
                <div className="flex items-center justify-between p-4 sm:p-6">
                    {/* Mobile logo */}
                    <Link href="/" className="flex items-center gap-2 lg:hidden">
                        <div className="h-8 w-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-lg shadow-sm">
                            I
                        </div>
                        <span className="font-bold text-lg tracking-tight">ILET</span>
                    </Link>
                    <div className="hidden lg:block md:w-1" />
                    <ThemeToggleIcon />
                </div>

                {/* Form content */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 pb-8">
                    <div className="w-full max-w-[400px]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
