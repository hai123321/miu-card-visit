import { ImageResponse } from 'next/og';
import { readProfile } from '@/lib/profile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const alt = 'Card visit';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function truncate(s: string, max: number): string {
  if (!s) return '';
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + '…';
}

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
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0 80px',
          color: '#fff',
          fontFamily: 'sans-serif',
          background: `linear-gradient(135deg, ${main} 0%, ${bg} 70%)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexShrink: 0,
            width: 240,
            height: 240,
            borderRadius: 9999,
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${main}, #7B2CFF)`,
            border: '6px solid rgba(255,255,255,0.35)',
            fontSize: 140,
            fontWeight: 800,
            color: '#fff',
            marginRight: 64,
          }}
        >
          {initial}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {truncate(p.name, 28)}
          </div>

          {p.handle ? (
            <div
              style={{
                display: 'flex',
                marginTop: 12,
                fontSize: 28,
                opacity: 0.65,
              }}
            >
              {`@${p.handle}`}
            </div>
          ) : null}

          {p.bio ? (
            <div
              style={{
                display: 'flex',
                marginTop: 28,
                fontSize: 30,
                lineHeight: 1.4,
                opacity: 0.88,
              }}
            >
              {truncate(p.bio, 140)}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
