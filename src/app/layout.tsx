import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'RoastBar Baku | Premium Specialty Coffee & Desserts',
  description:
    'RoastBar - Baku specialty coffee bar located at Şihali Qurbanov (Fizuli) 2/15. Handcrafted single-origin coffee, artisan desserts, open 08:00 - 00:30 daily.',
  keywords: [
    'RoastBar',
    'Baku coffee',
    'Specialty coffee Baku',
    'Baku cafe',
    'Qəhvə Bakı',
    'Şihali Qurbanov 2/15',
    'Roastbar Baku',
    'Espresso bar Baku',
  ],
  openGraph: {
    title: 'RoastBar Baku | Specialty Coffee & Desserts',
    description:
      'Artisanal coffee experience in the heart of Baku. Şihali Qurbanov (Fizuli) 2/15. Open 08:00 – 00:30.',
    url: 'https://roastbar.az',
    siteName: 'RoastBar Baku',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'RoastBar Baku',
      },
    ],
    locale: 'az_AZ',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#fdfbf7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-[#221710]" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
