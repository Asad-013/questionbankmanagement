import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex bg-background h-screen w-full items-center justify-center z-50 fixed inset-0">
            <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary animate-pulse">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground font-medium animate-pulse">Loading ILET...</p>
            </div>
        </div>
    );
}
