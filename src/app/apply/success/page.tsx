import Link from 'next/link';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Application Submitted - ILET',
  description: 'Your application has been submitted successfully',
};

export default function ApplicationSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-12 pb-8">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Application Submitted!
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Thank you for your interest in joining the ILET team. We have received your application and will review it shortly.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">What happens next?</p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Our team will review your application</li>
                  <li>• You&apos;ll receive an email once a decision is made</li>
                  <li>• The review process may take 2-3 business days</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full">
                Back to Home <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
