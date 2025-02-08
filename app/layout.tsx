import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QuizPreviewProvider } from '@/hooks/use-quiz-preview';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Navigators } from '@/components/navigators';
import { AppSidebar } from '@/components/app-sidebar';
import { AuthProvider } from '@/components/providers/auth-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SidebarProvider>
            <QuizPreviewProvider>
              <AppSidebar />
              <main>
                <Navigators />
                {children}
                <Toaster />
              </main>
            </QuizPreviewProvider>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
