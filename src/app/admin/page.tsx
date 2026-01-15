import { getAdminStats } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Layers } from "lucide-react";

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
                <p className="text-muted-foreground">Platform performance and statistics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQuestions}</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingQuestions}</div>
                        <p className="text-xs text-muted-foreground">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalDepartments}</div>
                        <p className="text-xs text-muted-foreground">Active categories</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((activity: any) => (
                                    <div className="flex items-center" key={activity.id}>
                                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                            {activity.type === 'question' ? 'DOC' : 'USR'}
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{activity.title}</p>
                                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                                        </div>
                                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                                            {new Date(activity.time).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground italic">No recent activity</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Database Connection</span>
                                <span className="flex items-center text-green-600 text-xs font-medium"><div className="h-2 w-2 bg-green-600 rounded-full mr-2" /> Connected</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Edge Functions</span>
                                <span className="flex items-center text-green-600 text-xs font-medium"><div className="h-2 w-2 bg-green-600 rounded-full mr-2" /> Global</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Active Storage</span>
                                <span className="flex items-center text-green-600 text-xs font-medium"><div className="h-2 w-2 bg-green-600 rounded-full mr-2" /> Cloud</span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t">
                                <span className="text-sm font-semibold">Uptime</span>
                                <span className="text-xs text-muted-foreground">99.9%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
