import type { Metadata, Viewport } from 'next';

import '@/styles/docs.css';
import '@zyncat/ui/styles.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://ui.zyncat.app'),
  title: { template: '%s - Zyncat UI', default: 'Zyncat UI — the $400 design system, minus the $400' },
  description:
    'Open-source, motion-first React 19 design system for dashboards and data-heavy apps. 30+ polished components on a small token vocabulary — no Tailwind, no CSS-in-JS. MIT.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Zyncat UI — the $400 design system, minus the $400',
    description:
      'Motion-first React components for dashboards and data-heavy apps, polished to paid-kit level. Token-driven theming, no Tailwind, MIT.',
    url: 'https://ui.zyncat.app',
    siteName: 'Zyncat UI',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zyncat UI — the $400 design system, minus the $400',
    description:
      'Motion-first React components for dashboards and data-heavy apps, polished to paid-kit level. Token-driven theming, no Tailwind, MIT.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = { themeColor: '#0b0b0c' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
