import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');

const MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
};

const NAME_RE = /^[A-Za-z0-9]{4,64}\.(png|jpe?g|webp|gif|svg)$/;

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const { name } = params;
  if (!NAME_RE.test(name)) {
    return new NextResponse('not_found', { status: 404 });
  }
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  const type = MIME[ext] ?? 'application/octet-stream';

  try {
    const buf = await fs.readFile(path.join(UPLOAD_DIR, name));
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': type,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('not_found', { status: 404 });
  }
}
