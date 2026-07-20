import type { Metadata } from 'next';
import { Instrument_Serif, Geist_Mono, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Track from '@/components/Track';
import Consent from '@/components/Consent';
import { CONTACT_EMAIL } from '@/content';
import './globals.css';

const display = Instrument_Serif({
  variable: '--font-display',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const mono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

const SITE = 'https://eigenv.ai';
const TITLE = 'EIGENV · We build and operate companies';
/* Present tense on the operating work, future on acquisitions. The previous
   description said "acquires and operates", which claimed deals the site
   itself says are still in search — and it is the most-syndicated string here. */
const DESCRIPTION =
  'EIGENV builds and operates the hard parts of a company: go-to-market, product, and leadership, alongside founders, investors, and owners. Our first acquisitions are in search.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s · EIGENV' },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'EIGENV',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

const ORGANISATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EIGENV',
  url: SITE,
  email: CONTACT_EMAIL,
  description: DESCRIPTION,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          // content is a local constant, not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION) }}
        />
        {/* Vercel Web Analytics (traffic) and Speed Insights (field vitals).
            Both no-op unless the project is deployed on Vercel. */}
        <Analytics />
        <SpeedInsights />
        <Track />
        <Consent />
      </body>
    </html>
  );
}
