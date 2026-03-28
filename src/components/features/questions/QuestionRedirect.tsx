"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuestionRedirectProps {
    id: string;
}

export function QuestionRedirect({ id }: QuestionRedirectProps) {
    const router = useRouter();

    useEffect(() => {
        router.replace(`/questions/${id}`);
    }, [id, router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-pulse text-muted-foreground">Loading question...</div>
        </div>
    );
}
