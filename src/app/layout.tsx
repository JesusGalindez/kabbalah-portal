import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import AudioEngine from '@/components/AudioEngine';
import SpiritualChat from '@/components/SpiritualChat';
import './globals.css';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ["latin"],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Kabbalah Portal',
  description: 'Premium, Transcendent and Versatile Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${inter.variable} antialiased`}>
        <AudioEngine />
        <SpiritualChat />
        {children}
      </body>
    </html>
  );
}
