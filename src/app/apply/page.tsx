import { ApplicationForm } from '@/components/features/application/ApplicationForm';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Footer7 } from '@/components/ui/footer-7';
import { Home as HomeIcon, Search, UploadCloud, Users } from 'lucide-react';

export const metadata = {
  title: 'Join as Admin/Moderator - ILET',
  description: 'Apply to become a moderator or admin and help grow the ILET community',
};

export default function ApplyPage() {
  const navItems = [
    { name: 'Home', link: '/', icon: <HomeIcon className="h-4 w-4" /> },
    { name: 'Questions', link: '/questions', icon: <Search className="h-4 w-4" /> },
    { name: 'Upload', link: '/upload', icon: <UploadCloud className="h-4 w-4" /> },
    { name: 'Join Team', link: '/apply', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-foreground selection:bg-primary/20">
      <FloatingNav navItems={navItems} />

      <main className="flex-1 w-full py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Join Our Team
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Become a moderator or admin and help manage the ILET community. 
              Shape the future of exam resources for ILET students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Moderate Content</h3>
              <p className="text-sm text-muted-foreground">
                Review and approve question submissions from the community
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Manage Resources</h3>
              <p className="text-sm text-muted-foreground">
                Help organize and categorize exam papers for better discoverability
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <UploadCloud className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Grow Community</h3>
              <p className="text-sm text-muted-foreground">
                Engage with fellow students and build a valuable resource hub
              </p>
            </div>
          </div>

          <ApplicationForm />
        </div>
      </main>

      <Footer7 />
    </div>
  );
}
