import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/features/admin/AdminHeader";
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
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <AdminSidebar className="hidden md:flex sticky top-0 h-screen" />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <AdminHeader userEmail={user.email || ""} />
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
