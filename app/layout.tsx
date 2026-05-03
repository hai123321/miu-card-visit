import type { Metadata } from 'next';
import { readProfile } from '@/lib/profile';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const p = await readProfile();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(siteUrl),
    title: p.meta.title,
    description: p.meta.description,
    openGraph: {
      type: 'website',
      url: siteUrl,
      siteName: p.name,
      title: p.meta.title,
      description: p.meta.description,
      // og:image is auto-injected from app/opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: p.meta.title,
      description: p.meta.description,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
