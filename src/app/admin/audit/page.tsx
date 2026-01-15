"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Search, ShieldCheck, UserCog, Database, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

const auditLogs = [
    { id: 1, event: "User Promoted", user: "admin@ilet.com", target: "user_452@gmail.com", type: "security", time: "2 mins ago", ip: "192.168.1.1" },
    { id: 2, event: "Bulk Delete", user: "moderator_1", target: "12 questions", type: "content", time: "15 mins ago", ip: "102.45.1.8" },
    { id: 3, event: "Department Created", user: "admin@ilet.com", target: "Bio-Tech", type: "system", time: "1 hour ago", ip: "192.168.1.1" },
    { id: 4, event: "Login Success", user: "student_99@univ.edu", target: "N/A", type: "auth", time: "2 hours ago", ip: "45.122.90.3" },
    { id: 5, event: "Question Rejected", user: "moderator_1", target: "question_uuid_88", type: "moderation", time: "5 hours ago", ip: "102.45.1.8" },
];

export default function AuditPage() {
    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'security': return { icon: ShieldCheck, color: "text-red-500 bg-red-500/10 border-red-200" };
            case 'content': return { icon: Database, color: "text-blue-500 bg-blue-500/10 border-blue-200" };
            case 'system': return { icon: UserCog, color: "text-purple-500 bg-purple-500/10 border-purple-200" };
            default: return { icon: Globe, color: "text-muted-foreground bg-muted border-muted-foreground/20" };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Audit Logs</h2>
                    <p className="text-muted-foreground">Historical records of all administrative actions.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search event or user..." className="pl-9" />
                </div>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="bg-muted/30">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" /> Recent Events
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Executor</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Source IP</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditLogs.map((log) => {
                                const config = getTypeConfig(log.type);
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`px-1.5 py-0.5 border ${config.color}`} variant="outline">
                                                    <config.icon className="h-3 w-3" />
                                                </Badge>
                                                <span className="font-semibold text-sm">{log.event}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm font-medium">{log.user}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{log.target}</TableCell>
                                        <TableCell className="font-mono text-[10px] text-muted-foreground">{log.ip}</TableCell>
                                        <TableCell className="text-right text-xs whitespace-nowrap">{log.time}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl flex items-start gap-4">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="font-bold text-amber-700">Audit Retention Policy</p>
                    <p className="text-amber-600/80">Logs are retained for 90 days. For enterprise archiving, please connect an external storage bucket in settings.</p>
                </div>
            </div>
        </div>
    );
}
