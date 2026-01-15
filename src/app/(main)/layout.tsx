import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <footer className="py-8 border-t bg-muted/40 mt-auto">
                <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div>
                        &copy; {new Date().getFullYear()} ILET Platform
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                        <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        <a href="#" className="hover:text-foreground transition-colors">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
