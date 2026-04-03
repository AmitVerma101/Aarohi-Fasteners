import './globals.css';
import AppShell from '@/components/AppShell';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.afsind.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aarohi Fastening Solutions — Precision Industrial Fasteners',
    template: '%s | Aarohi Fastening Solutions',
  },
  description:
    'Aarohi Fastening Solutions supplies industrial-grade bolts, nuts, screws, washers and precision fastening components. Serving manufacturers and engineers from Rohtak, India.',
  keywords: [
    'fasteners', 'industrial fasteners', 'bolts', 'nuts', 'screws', 'washers',
    'machine screw', 'grub screw', 'dowel pin', 'hex bolt', 'nyloc nut',
    'fastening solutions', 'Rohtak', 'India', 'Aarohi Fastening Solutions', 'AFS',
  ],
  authors: [{ name: 'Aarohi Fastening Solutions' }],
  openGraph: {
    type: 'website',
    siteName: 'Aarohi Fastening Solutions',
    title: 'Aarohi Fastening Solutions — Precision Industrial Fasteners',
    description:
      'Industrial-grade bolts, nuts, screws, washers and precision fastening components. Serving engineers and manufacturers across India.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary',
    title: 'Aarohi Fastening Solutions — Precision Industrial Fasteners',
    description:
      'Industrial-grade bolts, nuts, screws, washers and precision fastening components.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
