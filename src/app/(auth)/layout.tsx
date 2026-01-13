export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544256718-3bcf237f3974')] bg-cover bg-center opacity-50 mix-blend-overlay" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-lg font-bold">
                        <div className="h-8 w-8 rounded-lg bg-white text-black flex items-center justify-center">I</div>
                        ILET Platform
                    </div>
                </div>
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-3xl font-bold mb-4">"The foundation of every state is the education of its youth."</h2>
                    <p className="text-gray-300">- Diogenes</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-sm space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
