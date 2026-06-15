import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/features/profile/ProfileForm";

export default async function ProfilePage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/login");
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", userId)
        .single();

    if (!profile) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto max-w-3xl px-4 py-8">
            <div className="space-y-8">
                <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-8">
                    <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative flex items-center gap-5">
                        {profile.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt="Profile"
                                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-border shadow-lg"
                            />
                        ) : (
                            <div className="h-20 w-20 rounded-2xl bg-primary/15 text-primary flex items-center justify-center text-3xl font-bold shadow-inner">
                                {profile.full_name ? profile.full_name[0].toUpperCase() : profile.email?.[0].toUpperCase() || "U"}
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {profile.full_name || "Your Profile"}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">{profile.email}</p>
                            <div className="mt-2">
                                <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary uppercase tracking-wider">
                                    {profile.role}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
                    <div className="border-b bg-muted/30 px-6 py-4">
                        <h2 className="text-lg font-semibold">Personal Information</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Update your personal details and profile picture.
                        </p>
                    </div>
                    <div className="p-6">
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
        </div>
    );
}
