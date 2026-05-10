import { NextResponse } from 'next/server';
import { readProfile, writeProfile } from '@/lib/profile';
import { sanitizeRichHtml } from '@/lib/sanitize';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const profile = await readProfile();
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  let body: Profile;
  try {
    body = (await req.json()) as Profile;
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (!body || typeof body.name !== 'string' || !Array.isArray(body.links) || !Array.isArray(body.socials)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  if (body.donate) {
    const donate = body.donate;
    body.donate = {
      ...donate,
      subtitle: typeof donate.subtitle === 'string' ? sanitizeRichHtml(donate.subtitle) : '',
      methods: Array.isArray(donate.methods)
        ? donate.methods.map((m) => ({
            ...m,
            accountInfo:
              typeof m.accountInfo === 'string' ? sanitizeRichHtml(m.accountInfo) : '',
          }))
        : [],
      perks: Array.isArray(donate.perks) ? donate.perks : [],
    };
  }

  const saved = await writeProfile(body);
  return NextResponse.json(saved);
}
