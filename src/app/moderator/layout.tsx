import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminHeader } from "@/components/features/admin/AdminHeader";
import { AdminSidebar } from "@/components/features/admin/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/login");
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from("users")
        .select("role, email")
        .eq("clerk_id", userId)
        .single();

    if (!profile || (profile.role !== "admin" && profile.role !== "moderator")) {
        redirect("/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
            <AdminSidebar className="hidden md:flex sticky top-0 h-screen" role={profile.role} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <AdminHeader userEmail={profile.email || ""} role={profile.role} />
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
