import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check role
    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== "admin") {
        // Ideally show a 403 or redirect to home with a toast/error?
        // For now, redirect to home.
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="h-16 border-b flex items-center px-6 sticky top-0 bg-background/95 backdrop-blur z-10 justify-between">
                    <h1 className="font-semibold text-lg">Admin Panel</h1>
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">AD</div>
                        <div className="text-sm">
                            <p className="font-medium">Admin User</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </header>
                <div className="p-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
