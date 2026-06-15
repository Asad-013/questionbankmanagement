import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Bell, Clock } from "lucide-react";

export default async function NotificationsPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/login");
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

    if (!profile) {
        redirect("/login");
    }

    const { data: notifications } = await supabase
        .from("questions")
        .select(`
            id, 
            status, 
            exam_year, 
            rejection_reason, 
            reviewed_at,
            departments(name),
            courses(code)
        `)
        .eq("created_by", profile.id)
        .in("status", ["approved", "rejected"])
        .order("reviewed_at", { ascending: false })
        .limit(20);

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-8">
                    <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                            <Bell className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
                            <p className="text-muted-foreground text-sm mt-0.5">
                                Updates on your submitted questions and contributions.
                            </p>
                        </div>
                        {notifications && notifications.length > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                                {notifications.length} update{notifications.length !== 1 ? "s" : ""}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="space-y-3">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notif: any) => (
                            <div
                                key={notif.id}
                                className="group rounded-xl border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className={`h-1 w-full ${notif.status === 'approved' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                            notif.status === 'approved'
                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                : 'bg-red-500/10 text-red-600'
                                        }`}>
                                            {notif.status === 'approved' ? (
                                                <CheckCircle2 className="h-5 w-5" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-3">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {notif.courses?.code} - {notif.exam_year} Request
                                                </h3>
                                                <Badge
                                                    variant={notif.status === 'approved' ? "default" : "destructive"}
                                                    className="uppercase text-[10px] shrink-0"
                                                >
                                                    {notif.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                                                {notif.status === 'approved' ? (
                                                    <>
                                                        Your question for <span className="font-medium text-foreground">{notif.departments?.name}</span> was approved and is now live.
                                                    </>
                                                ) : (
                                                    <>
                                                        Your question was not approved.
                                                        {notif.rejection_reason && (
                                                            <span className="block mt-2 text-xs italic text-foreground/80 border-l-2 border-red-300 pl-3 py-1.5 bg-red-50/50 dark:bg-red-950/20 rounded-r-md">
                                                                &ldquo;{notif.rejection_reason}&rdquo;
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </p>
                                            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
                                                <Clock className="h-3 w-3" />
                                                {notif.reviewed_at ? new Date(notif.reviewed_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                }) : 'Recently'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-xl border border-dashed p-12 text-center">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                <Bell className="h-8 w-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">No notifications yet</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                When your submitted questions are reviewed, updates will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
