import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShieldCheck, ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { DebugRole } from "@/components/DebugRole";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <DebugRole />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background">
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background/50 backdrop-blur-sm mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                <span className="text-muted-foreground font-medium">The Official University Repository</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Master Your Exams <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">With Confidence.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Access a centralized library of past papers, organized by department and session. Prepare smarter, not harder.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/questions">
                  <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105">
                    Start Browsing <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-primary/20 hover:bg-background/80 transition-all hover:scale-105">
                    Contribute
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Abstract Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse duration-[5000ms]" />
        </section>

        {/* Stats / Trust */}
        <section className="border-y bg-muted/30 py-16 backdrop-blur-sm">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">12+</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Departments</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">850+</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Papers Archived</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">100%</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Moderated</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">24/7</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Access</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Why Students Trust ILET</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Built to streamline your study process with powerful tools and organization.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-card to-muted/30 border-none shadow-lg hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <LayoutGrid className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">Structured Taxonomy</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  Questions are meticulously organized by Department, Course Code, Exam Name, and Session for instant retrieval.
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted/30 border-none shadow-lg hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">Admin Moderation</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  Every submission goes through a rigorous approval process by administrators to ensure clarity and relevance.
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted/30 border-none shadow-lg hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Search className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">Smart Search</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  Filter by academic year, semester, or specific course codes to find exactly what you need in seconds.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container text-center relative z-10">
            <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to Ace Your Exams?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Join the community today. It's free, forever.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t bg-muted/20">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary/20 rounded-md flex items-center justify-center text-primary font-bold text-xs">I</div>
            <span className="font-semibold text-foreground">ILET Platform &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8 font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
