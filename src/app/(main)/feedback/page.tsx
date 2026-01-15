"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MessageSquare, Bug, Sparkles, Send, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { sendFeedback } from "@/lib/actions/feedback";

export default function FeedbackPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: "improvement" as "bug" | "improvement" | "other",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await sendFeedback(formData);
            if (result.success) {
                toast.success("Feedback sent! Thank you for helping us improve.");
                setFormData({
                    name: "",
                    email: "",
                    type: "improvement",
                    subject: "",
                    message: ""
                });
            } else {
                toast.error(result.error || "Failed to send feedback.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4 md:py-20 lg:py-24">
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Help us Build <br /><span className="text-primary">ILET Archive</span></h1>
                    <p className="text-muted-foreground text-lg">
                        Found a bug? Have an idea for a new feature? We&apos;d love to hear from you.
                    </p>
                </div>

                <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" /> Share your thoughts
                        </CardTitle>
                        <CardDescription>
                            Your feedback helps us make the platform better for everyone.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-background/50 border-border/40"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@du.ac.bd"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="bg-background/50 border-border/40"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Feedback Category</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'bug' })}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.type === 'bug'
                                                ? 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400'
                                                : 'border-border/40 bg-background/50 hover:bg-muted'
                                            }`}
                                    >
                                        <Bug className="h-5 w-5" />
                                        <span className="text-xs font-bold uppercase tracking-tighter">Bug Info</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'improvement' })}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.type === 'improvement'
                                                ? 'border-primary/50 bg-primary/10 text-primary'
                                                : 'border-border/40 bg-background/50 hover:bg-muted'
                                            }`}
                                    >
                                        <Sparkles className="h-5 w-5" />
                                        <span className="text-xs font-bold uppercase tracking-tighter">Ideas</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'other' })}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.type === 'other'
                                                ? 'border-primary/50 bg-primary/10 text-primary'
                                                : 'border-border/40 bg-background/50 hover:bg-muted'
                                            }`}
                                    >
                                        <MessageSquare className="h-5 w-5" />
                                        <span className="text-xs font-bold uppercase tracking-tighter">Other</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="Brief summary..."
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="bg-background/50 border-border/40"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Detailed Message</Label>
                                <textarea
                                    id="message"
                                    required
                                    rows={5}
                                    placeholder="Tell us more about the issue or suggestion..."
                                    className="flex w-full rounded-md border border-border/40 bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 shadow-xl shadow-primary/20 group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Submit Feedback <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-muted-foreground">
                    Your email will only be used to follow up on your feedback.
                </div>
            </div>
        </div>
    );
}
