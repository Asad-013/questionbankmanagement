"use client";

import { useState, useEffect } from "react";
import { getPendingQuestions, approveQuestion, rejectQuestion } from "@/lib/actions/moderation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Eye, Loader2, Calendar, User, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function ModerationPage() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    // Rejection Modal State
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedRejectId, setSelectedRejectId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");

    const fetchQuestions = async () => {
        setLoading(true);
        const data = await getPendingQuestions();
        setQuestions(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        toast.loading("Approving...");
        const { success, error } = await approveQuestion(id);
        toast.dismiss();

        if (success) {
            toast.success("Question approved");
            // Remove locally to feel instant
            setQuestions(prev => prev.filter(q => q.id !== id));
        } else {
            toast.error(error || "Failed to approve");
        }
        setProcessingId(null);
    };

    const openRejectModal = (id: string) => {
        setSelectedRejectId(id);
        setRejectReason("");
        setRejectModalOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedRejectId || !rejectReason.trim()) return;

        const id = selectedRejectId;
        setRejectModalOpen(false); // Close immediately for UX
        setProcessingId(id);
        toast.loading("Rejecting...");

        const { success, error } = await rejectQuestion(id, rejectReason);
        toast.dismiss();

        if (success) {
            toast.success("Question rejected");
            setQuestions(prev => prev.filter(q => q.id !== id));
        } else {
            toast.error(error || "Failed to reject");
        }
        setProcessingId(null);
        setSelectedRejectId(null);
    };

    if (loading && questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="relative">
                    <div className="h-16 w-16 bg-primary/10 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center relative z-10">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                </div>
                <p className="text-muted-foreground animate-pulse font-medium">Checking queue...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] border-2 border-dashed border-muted-foreground/10 rounded-3xl bg-card/50 p-8 text-center animate-in fade-in duration-500">
                <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-500/5">
                    <Check className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-3">All Caught Up!</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                    There are no pending questions to review at this time. <br />Great job keeping the queue clean.
                </p>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 gap-2" onClick={fetchQuestions}>
                    <RefreshCw className="h-4 w-4" /> Check Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Moderation Queue</h1>
                    <p className="text-muted-foreground mt-2">
                        Review and manage {questions.length} pending submissions.
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchQuestions}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
            </div>

            <div className="grid gap-6">
                {questions.map((q) => (
                    <Card key={q.id} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-muted group flex flex-col xl:flex-row">
                        {/* Image Section */}
                        <div
                            className="relative w-full xl:w-[400px] h-[300px] xl:h-auto bg-muted/30 cursor-pointer overflow-hidden border-b xl:border-b-0 xl:border-r border-border"
                            onClick={() => window.open(q.image_url, '_blank')}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={q.image_url}
                                alt="Preview"
                                className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+Error";
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                <Button variant="secondary" className="shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <Eye className="mr-2 h-4 w-4" /> Inspect Image
                                </Button>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col">
                            <CardContent className="flex-1 p-6 md:p-8">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline" className="bg-blue-500/5 text-blue-700 border-blue-200 px-3 py-1 text-xs uppercase tracking-wide font-semibold">
                                                {q.departments?.name || "Unknown Dept"}
                                            </Badge>
                                            <Badge variant="secondary" className="bg-secondary/50 px-3 py-1 text-xs">
                                                {q.exam_names?.name || "Unknown Exam"}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{q.courses?.title || "Untitled Course"}</h3>
                                            <div className="text-lg font-mono text-muted-foreground mt-1 flex items-center gap-2">
                                                {q.courses?.code || "NO-CODE"}
                                                {q.courses ? null : <AlertCircle className="h-4 w-4 text-amber-500" />}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                        <div className="text-sm bg-muted/40 px-4 py-2 rounded-lg border flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground text-xs uppercase font-bold">Session</span>
                                            <span className="font-semibold">{q.session || "N/A"} {q.exam_year}</span>
                                        </div>
                                        <div className="text-sm bg-muted/40 px-4 py-2 rounded-lg border flex items-center justify-between gap-3">
                                            <span className="text-muted-foreground text-xs uppercase font-bold">Date</span>
                                            <span className="font-mono text-xs">{new Date(q.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 py-4 border-t border-dashed">
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                            <User className="h-3 w-3" /> Submitted By
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border border-primary/10 text-primary font-bold shadow-sm">
                                                {(q.created_by_user?.email?.[0] || "U").toUpperCase()}
                                            </div>
                                            <div className="text-sm font-medium">
                                                {q.created_by_user?.email || "Unknown User"}
                                            </div>
                                        </div>
                                    </div>

                                    {q.description && (
                                        <div className="space-y-1.5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User Notes</span>
                                            <p className="text-sm text-foreground/80 bg-muted/30 p-3 rounded-lg border">
                                                {q.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 bg-muted/5 flex flex-col sm:flex-row justify-end gap-3 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full sm:w-auto text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30"
                                    onClick={() => openRejectModal(q.id)}
                                    disabled={!!processingId}
                                >
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button
                                    className="w-full sm:w-auto px-8 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                                    onClick={() => handleApprove(q.id)}
                                    disabled={!!processingId}
                                >
                                    {processingId === q.id ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <><Check className="mr-2 h-5 w-5" /> Approve & Publish</>
                                    )}
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Reject Modal */}
            <Modal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Reject Submission"
                description="Please provide a reason for rejecting this question. This will be sent to the user."
            >
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Reason for Rejection</Label>
                        <Input
                            placeholder="e.g. Duplicate question, Blurry image..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleRejectConfirm} disabled={!rejectReason.trim()}>
                            Confirm Rejection
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
