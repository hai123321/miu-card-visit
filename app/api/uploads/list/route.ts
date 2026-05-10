import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UPLOAD_DIR = path.join(process.cwd(), 'data', 'uploads');
const IMG_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

export async function GET() {
  try {
    const entries = await fs.readdir(UPLOAD_DIR, { withFileTypes: true });
    const files = await Promise.all(
      entries
        .filter((e) => e.isFile() && IMG_EXT.has(path.extname(e.name).toLowerCase()))
        .map(async (e) => {
          const stat = await fs.stat(path.join(UPLOAD_DIR, e.name));
          return {
            name: e.name,
            url: `/api/uploads/${e.name}`,
            mtime: stat.mtimeMs,
            size: stat.size,
          };
        }),
    );
    files.sort((a, b) => b.mtime - a.mtime);
    return NextResponse.json({ items: files });
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOENT') return NextResponse.json({ items: [] });
    return NextResponse.json({ error: 'list_failed' }, { status: 500 });
  }
}
