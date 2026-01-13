"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function DebugRole() {
    const [session, setSession] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function check() {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);

            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                setProfile(profile);
                if (error) console.error("Debug Profile Error:", JSON.stringify(error, null, 2));
            }
            setLoading(false);
        }
        check();
    }, []);

    if (!session) return null;

    return (
        <div className="fixed bottom-4 left-4 p-4 bg-black/80 text-white text-xs rounded-lg z-[100] max-w-sm pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
            <h3 className="font-bold border-b mb-2 pb-1">Debug Info</h3>
            <div>Email: {session.user.email}</div>
            <div>ID: {session.user.id}</div>
            <div className="mt-2 text-green-400">
                Role: {profile ? profile.role : "Loading..."}
            </div>
            {!profile && !loading && <div className="text-red-400">Profile fetch failed (RLS?)</div>}
        </div>
    );
}
