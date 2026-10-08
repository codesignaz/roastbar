import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { getServerThemeId, getServerTheme } from '@/lib/themeServer';

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
  const initialThemeId = getServerThemeId();
  const theme = getServerTheme();
  const c = theme.css;

  return (
    <html lang="az" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <style
          id="roastbar-ssr-theme-style"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --theme-bg: ${c.background};
                --theme-text: ${c.foreground};
                --theme-primary: ${c.primary};
                --theme-border: ${c.border};
              }
              body {
                background-color: ${c.background} !important;
                color: ${c.foreground} !important;
              }
              .bg-\\[\\#fdfbf7\\], .bg-\\[\\#f9f6f1\\] { background-color: ${c.background} !important; }
              .bg-\\[\\#fbf5ee\\], .bg-\\[\\#f6efe7\\] { background-color: ${c.primaryLight} !important; }
              .border-\\[\\#ebdcd0\\] { border-color: ${c.border} !important; }
              .bg-gradient-to-r.from-\\[\\#b87333\\].to-\\[\\#9c5c28\\],
              .bg-gradient-to-r.from-\\[\\#c98a58\\].to-\\[\\#995d30\\] {
                background-image: linear-gradient(to right, ${c.primaryGradientFrom}, ${c.primaryGradientTo}) !important;
              }
              .bg-\\[\\#fbf2ea\\], .bg-\\[\\#faf4ed\\] { background-color: ${c.badgeBg} !important; }
              .text-\\[\\#8f5222\\], .text-\\[\\#9c5c28\\] { color: ${c.badgeText} !important; }
              .text-\\[\\#b87333\\], .text-\\[\\#c98a58\\] { color: ${c.primary} !important; }
              .bg-\\[\\#b87333\\], .bg-\\[\\#c98a58\\] { background-color: ${c.primary} !important; }
              .hover\\:text-\\[\\#b87333\\]:hover { color: ${c.primary} !important; }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fdfbf7] text-[#221710]" suppressHydrationWarning>
        <ThemeProvider initialThemeId={initialThemeId}>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
