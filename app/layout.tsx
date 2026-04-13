import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import './globals.css';
import { BottomNav } from '@/components/BottomNav';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-headline',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Sourcing - Gestão de Suprimentos',
  description: 'Plataforma de sourcing e gestão de inventário',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable}`}>
      <body className="bg-surface font-body text-on-surface min-h-screen antialiased flex flex-col pb-24" suppressHydrationWarning>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
