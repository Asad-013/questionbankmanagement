"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { addModeratorByEmail } from "@/lib/actions/admin";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";

export function AddModeratorDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        toast.loading("Searching for user...");

        const { success, error } = await addModeratorByEmail(email);

        toast.dismiss();
        setLoading(false);

        if (success) {
            toast.success("User successfully promoted to Moderator!");
            setIsOpen(false);
            setEmail("");
        } else {
            toast.error(error || "Failed to promote user.");
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add Moderator
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add New Moderator"
                description="Enter the user's email address to grant them moderation access. The user must already be registered on the platform."
            >
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="user@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !email.trim()}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Promote to Moderator"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
