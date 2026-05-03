import { ImageResponse } from 'next/og';
import { readProfile } from '@/lib/profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const alt = 'Card visit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const p = await readProfile();
  const initial = (p.name?.trim()?.charAt(0) || 'H').toUpperCase();
  const main = p.theme.main || '#FB2D5A';
  const bg = p.theme.background || '#0F0F12';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
          color: '#fff',
          fontFamily: 'sans-serif',
          background: `radial-gradient(circle at 30% 20%, ${main} 0%, ${bg} 60%)`,
        }}
      >
        <div
          style={{
            width: 240,
            height: 240,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${main}, #7B2CFF)`,
            border: '6px solid rgba(255,255,255,0.35)',
            fontSize: 140,
            fontWeight: 800,
            color: '#fff',
          }}
        >
          {initial}
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: 40,
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          {p.name}
        </div>

        {p.handle ? (
          <div style={{ display: 'flex', marginTop: 8, fontSize: 30, opacity: 0.7 }}>
            {`@${p.handle}`}
          </div>
        ) : null}

        {p.bio ? (
          <div
            style={{
              display: 'flex',
              marginTop: 28,
              fontSize: 34,
              lineHeight: 1.35,
              opacity: 0.88,
              textAlign: 'center',
              maxWidth: 980,
            }}
          >
            {p.bio}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
