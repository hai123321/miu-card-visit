import { promises as fs } from 'fs';
import path from 'path';
import type { Profile } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');

export const defaultProfile: Profile = {
  name: 'Trieu Hai',
  handle: 'haitn',
  bio: 'Builder · AI / Product · Vietnam',
  avatarUrl: '/avatar-placeholder.svg',
  coverUrl: '',
  theme: {
    main: '#FB2D5A',
    mainText: '#FFFFFF',
    background: '#0F0F12',
    style: 'gradient',
  },
  links: [
    {
      id: 'l1',
      title: 'Liên hệ Zalo',
      url: 'https://zalo.me/0000000000',
      highlight: true,
    },
    {
      id: 'l2',
      title: 'Portfolio / Blog',
      url: 'https://example.com',
    },
  ],
  socials: [
    { id: 's1', platform: 'github', url: 'https://github.com/hai123321' },
    { id: 's2', platform: 'email', url: 'mailto:trieuhai02891@gmail.com' },
  ],
  resources: {
    title: 'Tài liệu và tool AI khác',
    pageSize: 5,
    items: [],
  },
  donate: {
    enabled: false,
    title: 'Tặng mình 1 ly cafe nha!',
    subtitle: '',
    qrUrl: '',
  },
  meta: {
    title: 'Trieu Hai — Card visit',
    description: 'All my links in one place.',
  },
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function mergeWithDefaults(parsed: Partial<Profile>): Profile {
  return {
    ...defaultProfile,
    ...parsed,
    theme: { ...defaultProfile.theme, ...(parsed.theme ?? {}) },
    meta: { ...defaultProfile.meta, ...(parsed.meta ?? {}) },
    resources: { ...defaultProfile.resources, ...(parsed.resources ?? {}) },
    donate: { ...defaultProfile.donate, ...(parsed.donate ?? {}) },
  };
}

export async function readProfile(): Promise<Profile> {
  try {
    const raw = await fs.readFile(PROFILE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<Profile>;
    return mergeWithDefaults(parsed);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code !== 'ENOENT') {
      // Don't take the page down for a corrupt or unreadable file.
      console.warn('[profile] readProfile fallback to defaults:', err);
      return defaultProfile;
    }
    try {
      await ensureDataDir();
      await fs.writeFile(PROFILE_FILE, JSON.stringify(defaultProfile, null, 2), 'utf8');
    } catch (writeErr) {
      // Volume mount may be read-only or owned by a different uid.
      // Serve defaults from memory so the page stays up.
      console.warn('[profile] cannot bootstrap data file, serving in-memory defaults:', writeErr);
    }
    return defaultProfile;
  }
}

export async function writeProfile(profile: Profile): Promise<Profile> {
  await ensureDataDir();
  const merged = mergeWithDefaults(profile);
  const tmp = `${PROFILE_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(merged, null, 2), 'utf8');
  await fs.rename(tmp, PROFILE_FILE);
  return merged;
}
