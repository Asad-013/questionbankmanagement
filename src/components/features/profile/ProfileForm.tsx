"use client";

import { useState } from "react";
import { updateProfile } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, Phone, ImagePlus, FileText, Save } from "lucide-react";
import { toast } from "sonner";

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
    const [avatarPreview, setAvatarPreview] = useState(initialData.avatar_url || "");

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
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        Full Name
                    </Label>
                    <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        placeholder="John Doe"
                        defaultValue={initialData.full_name}
                        className="h-11 rounded-xl"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                    <Input
                        type="email"
                        disabled
                        value={initialData.email}
                        className="h-11 rounded-xl bg-muted/40 text-muted-foreground"
                    />
                    <p className="text-[11px] text-muted-foreground/70">
                        Email cannot be changed.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Phone Number
                    </Label>
                    <Input
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        placeholder="+8801XXXXXXXXX"
                        defaultValue={initialData.phone_number}
                        className="h-11 rounded-xl"
                    />
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="avatar_url" className="text-sm font-medium flex items-center gap-2">
                        <ImagePlus className="h-3.5 w-3.5 text-muted-foreground" />
                        Avatar URL
                    </Label>
                    <div className="flex gap-3 items-start">
                        <div className="flex-1">
                            <Input
                                id="avatar_url"
                                name="avatar_url"
                                type="url"
                                placeholder="https://example.com/avatar.png"
                                defaultValue={initialData.avatar_url}
                                className="h-11 rounded-xl"
                                onChange={(e) => setAvatarPreview(e.target.value)}
                            />
                            <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                                Direct link to a JPEG, PNG, or GIF image.
                            </p>
                        </div>
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="h-11 w-11 rounded-xl object-cover border shrink-0"
                                onError={() => setAvatarPreview("")}
                            />
                        ) : (
                            <div className="h-11 w-11 rounded-xl border bg-muted/30 flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-muted-foreground/40" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        Bio
                    </Label>
                    <textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us a little about yourself..."
                        defaultValue={initialData.bio}
                        rows={4}
                        className="flex w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl h-11 px-6 font-medium"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
