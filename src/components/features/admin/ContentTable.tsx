"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteQuestion } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2, Trash2, Eye, FileText, CheckCircle, XCircle, Clock, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

export function ContentTable({ questions }: { questions: any[] }) {
    const [loadingIds, setLoadingIds] = useState<string[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

    const openDeleteModal = (id: string) => {
        setSelectedDeleteId(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedDeleteId) return;

        const id = selectedDeleteId;
        setDeleteModalOpen(false);
        setLoadingIds(prev => [...prev, id]);
        toast.loading("Deleting question...");

        const { success, error } = await deleteQuestion(id);

        toast.dismiss();
        setLoadingIds(prev => prev.filter(qid => qid !== id));

        if (success) {
            toast.success("Question deleted permanently");
        } else {
            toast.error(error || "Failed to delete");
        }
        setSelectedDeleteId(null);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved': return { icon: CheckCircle, className: "bg-green-500/10 text-green-600 border-green-200" };
            case 'rejected': return { icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-200" };
            default: return { icon: Clock, className: "bg-yellow-500/10 text-yellow-600 border-yellow-200" };
        }
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-in fade-in duration-500">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Exam Info</TableHead>
                        <TableHead className="hidden lg:table-cell">Uploader</TableHead>
                        <TableHead className="hidden md:table-cell">Uploaded Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {questions.map((q) => {
                        const config = getStatusConfig(q.status);
                        return (
                            <TableRow key={q.id} className="group transition-colors">
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={cn("gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", config.className)}
                                    >
                                        <config.icon className="h-3 w-3" />
                                        {q.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col min-w-0">
                                        <div className="font-bold text-foreground truncate">{q.courses?.code || "N/A"}</div>
                                        <div className="text-[10px] text-muted-foreground truncate max-w-[150px] opacity-70">
                                            {q.courses?.title || "No Title"}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-medium">{q.exam_names?.name || "Unknown Exam"}</div>
                                    <div className="text-[10px] text-muted-foreground">
                                        {q.exam_year} • {q.session}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground truncate max-w-[200px]">
                                            {q.uploader?.email || "System/Unknown"}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">User ID: {q.created_by?.slice(0, 8)}...</span>
                                    </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-mono">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(q.created_at).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                                            onClick={() => window.open(q.image_url, '_blank')}
                                            title="View Image"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                            disabled={loadingIds.includes(q.id)}
                                            onClick={() => openDeleteModal(q.id)}
                                            title="Delete Permanently"
                                        >
                                            {loadingIds.includes(q.id) ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {questions.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                <div className="flex flex-col items-center gap-2">
                                    <FileText className="h-8 w-8 opacity-20" />
                                    <span>No content found in the inventory.</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
            >
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-lg font-bold text-foreground">Are you absolutely sure?</h4>
                        <p className="text-sm text-muted-foreground max-w-xs transition-colors">
                            This will permanently remove this resource from the database. This action is irreversible.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                        <Button
                            variant="outline"
                            className="flex-1 h-11 order-2 sm:order-1"
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            No, Keep it
                        </Button>
                        <Button
                            variant="destructive"
                            className="flex-1 h-11 font-bold shadow-lg shadow-destructive/20 order-1 sm:order-2"
                            onClick={handleDelete}
                        >
                            Yes, Delete Paper
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
