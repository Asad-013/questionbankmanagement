import React from "react";
import { MessageSquare, Lightbulb, ArrowRight, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FeedbackCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="relative group">
                        {/* Decorative Border Glow */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-primary/10 to-primary/30 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        
                        <div className="relative bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                            {/* Inner Shine */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                            
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                        <Stars className="h-3 w-3" />
                                        <span>Shape the Future</span>
                                    </div>
                                    
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1]">
                                        Admins are looking for your <span className="text-primary italic">Feedback</span>.
                                    </h2>
                                    
                                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                                        Help us build the most comprehensive and user-friendly question bank for ILET. Your suggestions drive our next implementations.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link href="/feedback">
                                            <Button size="lg" className="rounded-xl px-8 font-bold shadow-xl shadow-primary/20 h-14 text-base">
                                                Share Feedback <MessageSquare className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                        <Link href="/feedback?type=improvement">
                                            <Button variant="outline" size="lg" className="rounded-xl px-8 font-bold h-14 text-base border-2">
                                                Suggest Feature <Lightbulb className="ml-2 h-5 w-5" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="hidden lg:grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            icon: MessageSquare,
                                            title: "Give Feedback",
                                            desc: "Report issues or tell us what you like.",
                                            color: "text-blue-500",
                                            bg: "bg-blue-500/10"
                                        },
                                        {
                                            icon: Lightbulb,
                                            title: "New Features",
                                            desc: "Wanted a new tool? Let us know.",
                                            color: "text-amber-500",
                                            bg: "bg-amber-500/10"
                                        },
                                        {
                                            icon: Stars,
                                            title: "Implementation",
                                            desc: "Your ideas go straight to development.",
                                            color: "text-purple-500",
                                            bg: "bg-purple-500/10"
                                        },
                                        {
                                            icon: ArrowRight,
                                            title: "Quick Response",
                                            desc: "Admins review every single suggestion.",
                                            color: "text-emerald-500",
                                            bg: "bg-emerald-500/10"
                                        }
                                    ].map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            className="p-6 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-4 font-bold shadow-sm", item.bg, item.color)}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
