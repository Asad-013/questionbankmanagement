"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ShieldCheck, ArrowRight, LayoutGrid, Sparkles, Home as HomeIcon, GraduationCap, UploadCloud, Clock } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Footer7 } from "@/components/ui/footer-7";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon className="h-4 w-4" /> },
    { name: "Questions", link: "/questions", icon: <Search className="h-4 w-4" /> },
    { name: "Upload", link: "/upload", icon: <UploadCloud className="h-4 w-4" /> }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
      <FloatingNav navItems={navItems} />

      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4 text-center z-10"
        >
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-background/50 backdrop-blur-sm mb-6 shadow-sm border-primary/20">
            <GraduationCap className="h-4 w-4 text-primary mr-2" />
            <span className="text-muted-foreground font-medium uppercase tracking-tighter">University of Dhaka • ILET</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight dark:text-white">
            Access The ILET <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Archive Effortlessly.</span>
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            The central question bank portal for the Institute of Leather Engineering and Technology. Browse and download previous years' papers across all engineering departments.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/questions">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-105 bg-primary text-white hover:bg-primary/90">
                Search Questions <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {!user && (
              <Link href="/register">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-neutral-200 dark:border-white/20 hover:bg-background/80 transition-all hover:scale-105">
                  Join Archive
                </Button>
              </Link>
            )}
            {user && (
              <Link href="/upload">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-neutral-200 dark:border-white/20 hover:bg-background/80 transition-all hover:scale-105">
                  Contribute Now
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </AuroraBackground>

      <main className="flex-1 w-full bg-background relative z-10">
        {/* Stats / Trust */}
        <section className="border-y bg-muted/30 py-16 backdrop-blur-sm">
          <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">3</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Departments</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">DU</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Institute</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">100%</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Verified Contribs</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-black text-foreground tracking-tight">Fast</div>
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Search</div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-20">
              <span className="text-primary font-bold tracking-widest uppercase text-xs">Community Focused</span>
              <h2 className="text-4xl font-bold tracking-tight mb-4 mt-2">Built for ILET Students</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                No more chasing seniors for papers. Our platform serves all three core engineering disciplines at ILET.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-card to-muted/30 border-none shadow-lg hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">Engineering Focused</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  Support for LE, LPE, and FE students with academic resources tailored to the Institute of Leather Engineering and Technology syllabus.
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted/30 border-none shadow-lg hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">Community Contributions</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  Anyone with a verified institutional email can contribute. Upload papers instantly and help your fellow classmates save time.
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-muted/30 border-none shadow-lg hover:shadow-xl transition-shadow group">
                <CardHeader>
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl">Save Time & Effort</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-relaxed">
                  Fast search filters for session, year, and course codes. Find the exact paper you need in seconds instead of hours of searching.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Department Highlight */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-10 text-muted-foreground uppercase tracking-widest">Supporting Our Departments</h3>
            <div className="flex flex-wrap justify-center gap-12 sm:gap-24 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="font-bold text-lg sm:text-2xl">Leather Engineering (LE)</div>
              <div className="font-bold text-lg sm:text-2xl">Leather Products Engineering (LPE)</div>
              <div className="font-bold text-lg sm:text-2xl">Footwear Engineering (FE)</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm text-primary">
              <Sparkles className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              {user ? "Ready to keep helping?" : "Ready to simplify your study life?"}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {user
                ? "Continue contributing to the archive and help your fellow students succeed."
                : "Join the ILET community archive. Access resources, upload papers, and keep student life efficient."}
            </p>
            <Link href={user ? "/questions" : "/register"}>
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-2xl shadow-primary/30 hover:scale-105 transition-transform bg-primary text-white">
                {user ? "Enter Archive" : "Register with Institutional Email"}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer7 />
    </div>
  );
}
