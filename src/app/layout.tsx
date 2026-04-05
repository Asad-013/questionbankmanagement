import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ILET - University Exam Question Repository",
  description: "A fast, scalable platform for university exam questions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ILET",
  },
  openGraph: {
    title: "ILET - University Exam Question Repository",
    description: "Access hundreds of past exam papers from the Institute of Leather Engineering and Technology, University of Dhaka.",
    type: "website",
    siteName: "ILET Question Archive",
  },
  twitter: {
    card: "summary_large_image",
    title: "ILET - University Exam Question Repository",
    description: "Access hundreds of past exam papers from the Institute of Leather Engineering and Technology, University of Dhaka.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider>
          {children}
          <InstallPrompt />
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
