"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ProfileFormProps = {
    initialData: {
        full_name: string;
        email: string;
        role: string;
        phone_number?: string;
        bio?: string;
        avatar_url?: string;
    }
};

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [loading, setLoading] = useState(false);

    async function handlestart(formData: FormData) {
        setLoading(true);
        toast.loading("Saving profile update...");

        const result = await updateProfile(formData);

        toast.dismiss();
        setLoading(false);

        if (result.success) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error(result.error || "Something went wrong.");
        }
    }

    return (
        <form action={handlestart} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                    <div className="flex gap-2 items-center">
                        <Input
                            id="email"
                            type="email"
                            disabled
                            value={initialData.email}
                            className="bg-muted/50 max-w-sm"
                        />
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Your email address cannot be changed from this screen.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="role" className="text-muted-foreground">Account Role</Label>
                    <div>
                        <Badge
                            variant={initialData.role === 'admin' ? "default" : "secondary"}
                            className={cn(
                                "uppercase text-xs tracking-wider font-bold py-1 px-3 mt-1",
                                initialData.role === 'admin' ? "bg-primary shadow-sm" : "bg-muted text-foreground border shadow-sm"
                            )}
                        >
                            {initialData.role}
                        </Badge>
                    </div>
                </div>

                <div className="space-y-2 pt-4">
                    <Label htmlFor="full_name" className="font-semibold">Full Name</Label>
                    <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="John Doe"
                        defaultValue={initialData.full_name}
                        className="max-w-sm focus-visible:ring-primary"
                    />
                </div>

                <div className="space-y-2 pt-4">
                    <Label htmlFor="phone_number" className="font-semibold">Phone Number</Label>
                    <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        placeholder="+8801XXXXXXXXX"
                        defaultValue={initialData.phone_number}
                        className="max-w-sm focus-visible:ring-primary"
                    />
                </div>

                <div className="space-y-2 pt-4">
                    <Label htmlFor="avatar_url" className="font-semibold">Avatar Image URL</Label>
                    <Input
                        id="avatar_url"
                        name="avatar_url"
                        type="url"
                        placeholder="https://example.com/avatar.png"
                        defaultValue={initialData.avatar_url}
                        className="max-w-sm focus-visible:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Provide a direct link to an image (JPEG, PNG, GIF).
                    </p>
                </div>

                <div className="space-y-2 pt-4">
                    <Label htmlFor="bio" className="font-semibold">Biography</Label>
                    <textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us a little about yourself..."
                        defaultValue={initialData.bio}
                        rows={4}
                        className="flex w-full max-w-lg rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="pt-4 border-t mt-8">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto min-w-[140px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}
