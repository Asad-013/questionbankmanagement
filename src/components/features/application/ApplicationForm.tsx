'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, AlertCircle, Phone, MapPin, GraduationCap, Building2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitApplication } from '@/lib/actions/application';

const applicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  whatsapp: z.string().regex(/^\+?[\d\s-]{10,15}$/, 'Enter a valid WhatsApp number (e.g., +8801xxxxxxxxx)'),
  university: z.string().min(2, 'University name is required'),
  department: z.string().min(2, 'Department is required'),
  session: z.string().min(1, 'Session is required'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export function ApplicationForm() {
  const [isPending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError('');

    if (!selectedFile) return;

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (selectedFile.size > maxSize) {
      setFileError('File size must be less than 10MB');
      return;
    }

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError('Only JPEG, PNG, WebP, and PDF files are allowed');
      return;
    }

    setFile(selectedFile);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!file) {
      setFileError('Please upload your university ID card');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('address', data.address);
      formData.append('whatsapp', data.whatsapp);
      formData.append('university', data.university);
      formData.append('department', data.department);
      formData.append('session', data.session);
      formData.append('idCard', file);

      const result = await submitApplication(formData);

      if (result.success) {
        toast.success('Application submitted successfully!');
        reset();
        setFile(null);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to submit application');
      }
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          Join Our Team
        </CardTitle>
        <CardDescription>
          Apply to become a moderator or admin. Help manage and grow the ILET community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  className="pl-10"
                  placeholder="+8801xxxxxxxxx"
                  {...register('whatsapp')}
                />
              </div>
              {errors.whatsapp && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.whatsapp.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                className="pl-10"
                placeholder="Your current address"
                {...register('address')}
              />
            </div>
            {errors.address && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university">University *</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="university"
                  className="pl-10"
                  placeholder="University of Dhaka"
                  {...register('university')}
                />
              </div>
              {errors.university && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.university.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="department"
                  className="pl-10"
                  placeholder="ILET"
                  {...register('department')}
                />
              </div>
              {errors.department && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="session">Session *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="session"
                  className="pl-10"
                  placeholder="2024-25"
                  {...register('session')}
                />
              </div>
              {errors.session && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.session.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idCard">University ID Card *</Label>
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
              <input
                id="idCard"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="idCard" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  {file ? (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Click to upload your ID card</p>
                      <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, or PDF (max 10MB)</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            {fileError && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {fileError}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
