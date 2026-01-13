import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center p-4">
            <div className="bg-muted/30 p-8 rounded-full mb-6">
                <FileQuestion className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
                404
            </h1>
            <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="default">Return Home</Button>
                </Link>
                <Link href="/questions">
                    <Button variant="outline">Browse Questions</Button>
                </Link>
            </div>
        </div>
    );
}
