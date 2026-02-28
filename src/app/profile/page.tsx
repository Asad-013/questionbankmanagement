import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/features/profile/ProfileForm";

export default async function ProfilePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-32">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and personal information.
                    </p>
                </div>

                <div className="p-6 border rounded-xl bg-card shadow-sm">
                    <ProfileForm
                        initialData={{
                            full_name: profile.full_name || "",
                            email: profile.email,
                            role: profile.role,
                            phone_number: profile.phone_number || "",
                            bio: profile.bio || "",
                            avatar_url: profile.avatar_url || ""
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
