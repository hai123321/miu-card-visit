import type { Metadata } from 'next';
import { readProfile } from '@/lib/profile';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const p = await readProfile();
  return {
    title: p.meta.title,
    description: p.meta.description,
    openGraph: {
      title: p.meta.title,
      description: p.meta.description,
      images: p.coverUrl || p.avatarUrl ? [{ url: p.coverUrl || p.avatarUrl }] : [],
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
