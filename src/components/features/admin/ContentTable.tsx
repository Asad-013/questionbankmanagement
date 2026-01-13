"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteQuestion } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2, Trash2, Eye, FileText, CheckCircle, XCircle, Clock } from "lucide-react";

export function ContentTable({ questions }: { questions: any[] }) {
    const [loadingIds, setLoadingIds] = useState<string[]>([]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to permanently delete this question?")) return;

        setLoadingIds(prev => [...prev, id]);
        toast.loading("Deleting question...");

        const { success, error } = await deleteQuestion(id);

        toast.dismiss();
        setLoadingIds(prev => prev.filter(qid => qid !== id));

        if (success) {
            toast.success("Question deleted");
        } else {
            toast.error(error || "Failed to delete");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Clock className="h-4 w-4 text-yellow-500" />;
        }
    };

    return (
        <div className="rounded-md border bg-card shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                    <tr>
                        <th className="p-4">Status</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">Exam Info</th>
                        <th className="p-4 hidden md:table-cell">Uploaded Info</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {questions.map((q) => (
                        <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-2" title={q.status}>
                                    {getStatusIcon(q.status)}
                                    <span className="capitalize hidden sm:inline">{q.status}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="font-medium text-foreground">{q.courses?.code}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{q.courses?.title}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-foreground">{q.exam_names?.name}</div>
                                <div className="text-xs text-muted-foreground">{q.exam_year} • {q.session}</div>
                            </td>
                            <td className="p-4 hidden md:table-cell text-muted-foreground">
                                {new Date(q.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.open(q.image_url, '_blank')}
                                        title="View Image"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        disabled={loadingIds.includes(q.id)}
                                        onClick={() => handleDelete(q.id)}
                                        title="Delete Permanently"
                                    >
                                        {loadingIds.includes(q.id) ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
