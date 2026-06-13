"use client";

import { useEffect, useState } from "react";
import { getAllFeedback } from "@/lib/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { MessageSquare, Bug, Sparkles, AlertCircle, Eye, Search, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface FeedbackItem {
    id: string;
    name: string;
    email: string;
    type: "bug" | "improvement" | "other";
    subject: string;
    message: string;
    image_url?: string;
    created_at: string;
}

export default function AdminFeedbackPage() {
    const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
    const [sortAscending, setSortAscending] = useState(false);

    useEffect(() => {
        async function loadFeedback() {
            try {
                const data = await getAllFeedback();
                setFeedback(data || []);
            } catch (err: any) {
                console.error("Failed to load feedback:", err);
                toast.error("Failed to load feedback submissions.");
            } finally {
                setLoading(false);
            }
        }
        loadFeedback();
    }, []);

    const filteredFeedback = feedback
        .filter((item) => {
            const matchesSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.message.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = selectedType === "all" || item.type === selectedType;
            
            return matchesSearch && matchesType;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortAscending ? dateA - dateB : dateB - dateA;
        });

    const getTypeBadge = (type: string) => {
        switch (type) {
            case "bug":
                return (
                    <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <Bug className="h-3 w-3" /> Bug
                    </Badge>
                );
            case "improvement":
                return (
                    <Badge className="bg-blue-600 text-white flex items-center gap-1 w-fit hover:bg-blue-700">
                        <Sparkles className="h-3 w-3" /> Idea
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <MessageSquare className="h-3 w-3" /> Other
                    </Badge>
                );
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Feedback</h2>
                    <p className="text-muted-foreground">View bug reports, ideas, and general feedback from platform users.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card 
                    className={`cursor-pointer transition-all hover:scale-[1.02] border-none shadow-sm ${selectedType === "all" ? "bg-primary text-primary-foreground" : "bg-card"}`}
                    onClick={() => setSelectedType("all")}
                >
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-semibold">All Feedback</CardTitle>
                        <MessageSquare className="h-4 w-4 opacity-70" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">{feedback.length}</div>
                        <p className={`text-xs ${selectedType === "all" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>Total submissions</p>
                    </CardContent>
                </Card>

                <Card 
                    className={`cursor-pointer transition-all hover:scale-[1.02] border-none shadow-sm ${selectedType === "bug" ? "bg-red-500 text-white" : "bg-card"}`}
                    onClick={() => setSelectedType("bug")}
                >
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-semibold">Bugs</CardTitle>
                        <Bug className="h-4 w-4 opacity-70" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                            {feedback.filter(f => f.type === 'bug').length}
                        </div>
                        <p className={`text-xs ${selectedType === "bug" ? "text-white/80" : "text-muted-foreground"}`}>Requires fix</p>
                    </CardContent>
                </Card>

                <Card 
                    className={`cursor-pointer transition-all hover:scale-[1.02] border-none shadow-sm ${selectedType === "improvement" ? "bg-blue-600 text-white" : "bg-card"}`}
                    onClick={() => setSelectedType("improvement")}
                >
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-semibold">Ideas / Improvements</CardTitle>
                        <Sparkles className="h-4 w-4 opacity-70" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                            {feedback.filter(f => f.type === 'improvement').length}
                        </div>
                        <p className={`text-xs ${selectedType === "improvement" ? "text-white/80" : "text-muted-foreground"}`}>Suggestions</p>
                    </CardContent>
                </Card>

                <Card 
                    className={`cursor-pointer transition-all hover:scale-[1.02] border-none shadow-sm ${selectedType === "other" ? "bg-neutral-800 text-white" : "bg-card"}`}
                    onClick={() => setSelectedType("other")}
                >
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-semibold">Other</CardTitle>
                        <MessageSquare className="h-4 w-4 opacity-70" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">
                            {feedback.filter(f => f.type === 'other').length}
                        </div>
                        <p className={`text-xs ${selectedType === "other" ? "text-white/80" : "text-muted-foreground"}`}>General queries</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-sm bg-card">
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4">
                    <div>
                        <CardTitle>Submissions Directory</CardTitle>
                        <CardDescription>Search and filter user feedback entries.</CardDescription>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search sender, subject or text..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSortAscending(!sortAscending)}
                            title="Sort by date"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="text-center py-20 text-muted-foreground">
                            Loading submissions...
                        </div>
                    ) : filteredFeedback.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Sender</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="hidden md:table-cell">Snippet</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredFeedback.map((item) => (
                                        <TableRow key={item.id} className="hover:bg-muted/30">
                                            <TableCell>{getTypeBadge(item.type)}</TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-sm">{item.name}</div>
                                                <div className="text-xs text-muted-foreground font-mono">{item.email}</div>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[180px] truncate">
                                                {item.subject}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground hidden md:table-cell max-w-[240px] truncate">
                                                {item.message}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(item.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedFeedback(item)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1.5" /> View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <AlertCircle className="h-8 w-8 text-muted-foreground/60" />
                            <p className="italic">No feedback submissions found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Feedback details modal */}
            {selectedFeedback && (
                <Modal
                    isOpen={!!selectedFeedback}
                    onClose={() => setSelectedFeedback(null)}
                    title="Feedback Details"
                    description={`Submitted on ${new Date(selectedFeedback.created_at).toLocaleString()}`}
                >
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sender</p>
                                <p className="font-semibold">{selectedFeedback.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{selectedFeedback.email}</p>
                            </div>
                            <div>
                                {getTypeBadge(selectedFeedback.type)}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Subject</p>
                            <p className="font-semibold text-foreground text-base">{selectedFeedback.subject}</p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Message</p>
                            <div className="bg-muted p-4 rounded-xl text-sm leading-relaxed text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto border border-border/50">
                                {selectedFeedback.message}
                            </div>
                        </div>

                        {selectedFeedback.image_url && (
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Attachment</p>
                                <a 
                                    href={selectedFeedback.image_url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="block relative aspect-video w-full overflow-hidden rounded-xl border bg-muted/30 hover:opacity-90 transition-opacity"
                                >
                                    <img 
                                        src={selectedFeedback.image_url} 
                                        alt="Attachment" 
                                        className="w-full h-full object-contain"
                                    />
                                </a>
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button onClick={() => setSelectedFeedback(null)}>Close</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
