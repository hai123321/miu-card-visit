import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB
const ALLOWED: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'invalid_form' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: 'missing_file' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'empty_file' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'file_too_large', maxBytes: MAX_BYTES }, { status: 413 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: 'unsupported_type', type: file.type }, { status: 415 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const buf = Buffer.from(await file.arrayBuffer());
  const filename = `${crypto.randomBytes(8).toString('hex')}.${ext}`;
  const dest = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(dest, buf);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
