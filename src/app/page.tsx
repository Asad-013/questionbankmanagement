import Link from "next/link";
import { getQuestions } from "@/lib/actions/questions";
import { QuestionsGallery } from "@/components/features/questions/QuestionsGallery";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, UploadCloud, Clock, Home as HomeIcon, Search, GraduationCap, ArrowRight, Users, FileText, Zap } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Footer7 } from "@/components/ui/footer-7";
import { WelcomeBanner } from "@/components/shared/WelcomeBanner";
import { HeroContent } from "@/components/shared/HeroContent";
import { UserDependentText } from "@/components/shared/UserDependentContent";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";

export default async function Home() {
    const questions = await getQuestions();
    const previewQuestions = questions?.slice(0, 12) || [];

    const navItems = [
        { name: "Home", link: "/", icon: <HomeIcon className="h-4 w-4" /> },
        { name: "Questions", link: "/questions", icon: <Search className="h-4 w-4" /> },
        { name: "Upload", link: "/upload", icon: <UploadCloud className="h-4 w-4" /> },
        { name: "Join Team", link: "/apply", icon: <Users className="h-4 w-4" /> }
    ];

    return (
        <div className="flex flex-col min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
            <FloatingNav navItems={navItems} />

            <WelcomeBanner />

            <AuroraBackground>
                <HeroContent />
            </AuroraBackground>

            <main className="flex-1 w-full bg-background relative z-10">
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

                {previewQuestions.length > 0 && <QuestionsGallery questions={previewQuestions} />}

                <section className="py-16 md:py-24 bg-muted/10">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">How It Works</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
                                Three Simple Steps
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="h-16 w-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-bold mb-2">Browse Questions</h3>
                                <p className="text-muted-foreground text-sm">
                                    Find past exam papers by department, course code, or year
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="h-16 w-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    2
                                </div>
                                <h3 className="text-lg font-bold mb-2">Choose Resource</h3>
                                <p className="text-muted-foreground text-sm">
                                    Click on any question paper to view full details and verification status
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="h-16 w-16 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-bold mb-2">Download / Access Instantly</h3>
                                <p className="text-muted-foreground text-sm">
                                    Get immediate, free access to view or download high-quality files
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-10">
                            <Link href="/questions">
                                <Button size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90">
                                    Explore Question Bank <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Features</span>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
                                Built for ILET Students
                            </h2>
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

                <section className="py-16 md:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 -z-10" />
                    <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
                        <div className="h-16 w-16 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm text-primary">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <UserDependentText />
                    </div>
                </section>

                <FeedbackCTA />
            </main>

            <Footer7 />
        </div>
    );
}
