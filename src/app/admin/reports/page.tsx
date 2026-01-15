"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, FileText, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">System Reports</h2>
                    <p className="text-muted-foreground">Detailed analytics and platform usage statistics.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                    <Button size="sm" className="h-9 gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily New Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +12% from yesterday
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Uploads</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">452</div>
                        <div className="flex items-center text-xs text-green-500 mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +5% from yesterday
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24.5%</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            Upload to moderation time
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
                        <Badge className="bg-green-500/10 text-green-600 border-green-200 text-[10px]">Normal</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                            Background nodes active
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg border-primary/10">
                    <CardHeader>
                        <CardTitle>Popular Departments</CardTitle>
                        <CardDescription>Most active departments by volume.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Computer Science", value: 85, color: "bg-blue-500" },
                                { name: "Electrical Engineering", value: 65, color: "bg-indigo-500" },
                                { name: "Business Administration", value: 45, color: "bg-purple-500" },
                                { name: "Physics", value: 30, color: "bg-pink-500" },
                            ].map((item) => (
                                <div key={item.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-muted-foreground">{item.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                            style={{ width: `${item.value}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-primary/10">
                    <CardHeader>
                        <CardTitle>Peak Upload Times</CardTitle>
                        <CardDescription>Hour-by-hour distribution of uploads.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-end justify-between px-4 pb-2 pt-6">
                        {[40, 60, 30, 80, 50, 90, 45, 70, 85, 40].map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 group cursor-help">
                                <div
                                    className="w-4 sm:w-6 bg-primary/20 hover:bg-primary rounded-t-sm transition-all relative"
                                    style={{ height: `${h * 1.5}px` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border px-2 py-1 rounded text-[10px] font-bold shadow-xl z-10 whitespace-nowrap">
                                        {h} uploads
                                    </div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-mono">{i * 2}h</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
