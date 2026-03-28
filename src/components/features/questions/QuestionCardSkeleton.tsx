import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuestionCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full flex flex-col border-border/40 bg-card/50 backdrop-blur-sm">
            <div className="relative aspect-video bg-muted overflow-hidden border-b border-border/50">
                <Skeleton className="absolute inset-0" />
            </div>

            <CardContent className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                <div className="space-y-1.5">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                </div>

                <div className="mt-auto pt-4 border-t border-border/50">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-4 rounded" />
            </CardFooter>
        </Card>
    );
}
