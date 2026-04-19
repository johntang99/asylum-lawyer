import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: '正道移民服务中心',
  description: '洛杉矶专业中文庇护移民律师，提供政治庇护、移民签证等法律服务。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className={inter.variable} suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  );
}
