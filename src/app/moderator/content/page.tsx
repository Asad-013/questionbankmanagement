import { getAllContent } from "@/lib/actions/admin";
import { ContentTable } from "@/components/features/admin/ContentTable";

export default async function ContentPage() {
    const questions = await getAllContent();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Question Archive</h2>
                <p className="text-muted-foreground">Manage and organize all archived papers.</p>
            </div>
            <ContentTable questions={questions || []} />
        </div>
    );
}
