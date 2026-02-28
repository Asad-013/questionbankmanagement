import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function NotificationsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: notifications, error } = await supabase
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
        .eq("created_by", user.id)
        .in("status", ["approved", "rejected"])
        .order("reviewed_at", { ascending: false })
        .limit(20);

    return (
        <div className="container mx-auto max-w-2xl px-4 py-32">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Activity</h1>
                    <p className="text-muted-foreground">
                        Updates on your submitted questions and contributions.
                    </p>
                </div>

                <div className="space-y-4">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((notif: any) => (
                            <Card key={notif.id} className="overflow-hidden">
                                <div className={`h-1 w-full ${notif.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <CardHeader className="py-4 pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {notif.status === 'approved' ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                            {notif.courses?.code} - {notif.exam_year} Request
                                        </CardTitle>
                                        <Badge variant={notif.status === 'approved' ? "default" : "destructive"} className="uppercase">
                                            {notif.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 pb-4 text-sm text-muted-foreground">
                                    {notif.status === 'approved' ? (
                                        <p>Your question for {notif.departments?.name} was officially approved and is now live in the question bank!</p>
                                    ) : (
                                        <p>
                                            Unfortunately, your question was rejected.
                                            {notif.rejection_reason && <span className="block mt-2 italic text-foreground border-l-2 pl-3 py-1 bg-muted/50 rounded-r-md">"{notif.rejection_reason}"</span>}
                                        </p>
                                    )}
                                    <div className="mt-3 text-[10px] text-muted-foreground/60 uppercase font-bold tracking-wider">
                                        {notif.reviewed_at ? new Date(notif.reviewed_at).toLocaleDateString() : 'Recently'}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="p-8 border border-dashed rounded-xl text-center">
                            <p className="text-muted-foreground">You have no recent moderation activity.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
