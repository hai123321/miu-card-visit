'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, GripVertical, ArrowUp, ArrowDown,
  LogOut, Save, Eye, Upload, Loader2,
} from 'lucide-react';
import type { LinkItem, Profile, SocialItem } from '@/lib/types';

const PLATFORMS: SocialItem['platform'][] = [
  'facebook', 'instagram', 'github', 'linkedin',
  'youtube', 'tiktok', 'twitter', 'email', 'phone', 'website',
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function AdminEditor({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const themeStyle = useMemo(
    () =>
      ({
        '--brand': profile.theme.main,
        '--brand-fg': profile.theme.mainText,
      }) as React.CSSProperties,
    [profile.theme.main, profile.theme.mainText],
  );

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function updateTheme(patch: Partial<Profile['theme']>) {
    setProfile((p) => ({ ...p, theme: { ...p.theme, ...patch } }));
  }

  function updateMeta(patch: Partial<Profile['meta']>) {
    setProfile((p) => ({ ...p, meta: { ...p.meta, ...patch } }));
  }

  function updateLink(id: string, patch: Partial<LinkItem>) {
    setProfile((p) => ({
      ...p,
      links: p.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }

  function moveLink(id: string, dir: -1 | 1) {
    setProfile((p) => {
      const idx = p.links.findIndex((l) => l.id === id);
      if (idx < 0) return p;
      const next = [...p.links];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return p;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...p, links: next };
    });
  }

  function addLink() {
    setProfile((p) => ({
      ...p,
      links: [...p.links, { id: uid(), title: 'New link', url: 'https://' }],
    }));
  }

  function removeLink(id: string) {
    setProfile((p) => ({ ...p, links: p.links.filter((l) => l.id !== id) }));
  }

  function updateSocial(id: string, patch: Partial<SocialItem>) {
    setProfile((p) => ({
      ...p,
      socials: p.socials.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }

  function addSocial() {
    setProfile((p) => ({
      ...p,
      socials: [...p.socials, { id: uid(), platform: 'website', url: 'https://' }],
    }));
  }

  function removeSocial(id: string) {
    setProfile((p) => ({ ...p, socials: p.socials.filter((s) => s.id !== id) }));
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Đang chuyển hướng…');
          setTimeout(() => router.replace('/admin/login'), 800);
          return;
        }
        setError(data?.error || 'Lưu thất bại');
        return;
      }
      const saved = (await res.json()) as Profile;
      setProfile(saved);
      setSavedAt(Date.now());
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  return (
    <main style={themeStyle} className="min-h-dvh bg-[#0F0F12] text-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/40 ring-1 ring-white/5">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center gap-3">
          <h1 className="text-base font-semibold">Admin · Card visit</h1>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-1.5"
            >
              <Eye className="h-4 w-4" /> Xem
            </a>
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-[var(--brand)] text-[var(--brand-fg)] font-semibold px-3 py-1.5 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {saving ? 'Đang lưu…' : 'Lưu'}
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-1.5"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        {savedAt ? (
          <div className="max-w-3xl mx-auto px-5 pb-2 text-xs text-emerald-400">
            Đã lưu lúc {new Date(savedAt).toLocaleTimeString('vi-VN')}
          </div>
        ) : null}
        {error ? (
          <div className="max-w-3xl mx-auto px-5 pb-2 text-xs text-red-400">{error}</div>
        ) : null}
      </header>

      <div className="max-w-3xl mx-auto px-5 py-6 flex flex-col gap-6">
        <Section title="Hồ sơ">
          <Field label="Tên hiển thị">
            <input
              value={profile.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Handle (username)">
            <input
              value={profile.handle}
              onChange={(e) => update('handle', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Bio">
            <textarea
              value={profile.bio}
              onChange={(e) => update('bio', e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>
          <Field label="Avatar">
            <AvatarField
              value={profile.avatarUrl}
              onChange={(v) => update('avatarUrl', v)}
              onError={(msg) => setError(msg)}
              onSessionExpired={() => {
                setError('Phiên đăng nhập đã hết hạn. Đang chuyển hướng…');
                setTimeout(() => router.replace('/admin/login'), 800);
              }}
            />
          </Field>
        </Section>

        <Section title="Theme">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Màu chính">
              <ColorInput
                value={profile.theme.main}
                onChange={(v) => updateTheme({ main: v })}
              />
            </Field>
            <Field label="Màu chữ trên màu chính">
              <ColorInput
                value={profile.theme.mainText}
                onChange={(v) => updateTheme({ mainText: v })}
              />
            </Field>
            <Field label="Màu nền">
              <ColorInput
                value={profile.theme.background}
                onChange={(v) => updateTheme({ background: v })}
              />
            </Field>
            <Field label="Kiểu nền">
              <select
                value={profile.theme.style}
                onChange={(e) =>
                  updateTheme({ style: e.target.value as Profile['theme']['style'] })
                }
                className={inputCls}
              >
                <option value="gradient">Gradient</option>
                <option value="solid">Solid</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section
          title="Liên kết"
          right={
            <button onClick={addLink} className={addBtnCls}>
              <Plus className="h-4 w-4" /> Thêm
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {profile.links.map((l, i) => (
              <div
                key={l.id}
                className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-white/40" />
                  <input
                    value={l.title}
                    onChange={(e) => updateLink(l.id, { title: e.target.value })}
                    placeholder="Tiêu đề"
                    className={`${inputBase} flex-1 min-w-0`}
                  />
                  <div className="flex">
                    <button
                      onClick={() => moveLink(l.id, -1)}
                      disabled={i === 0}
                      className={iconBtnCls}
                      aria-label="Lên"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveLink(l.id, 1)}
                      disabled={i === profile.links.length - 1}
                      className={iconBtnCls}
                      aria-label="Xuống"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeLink(l.id)}
                      className={`${iconBtnCls} hover:text-red-400`}
                      aria-label="Xoá"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <input
                  value={l.url}
                  onChange={(e) => updateLink(l.id, { url: e.target.value })}
                  placeholder="https://"
                  className={inputCls}
                />
                <label className="inline-flex items-center gap-2 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={!!l.highlight}
                    onChange={(e) => updateLink(l.id, { highlight: e.target.checked })}
                    className="accent-[var(--brand)]"
                  />
                  Highlight (dùng màu thương hiệu)
                </label>
              </div>
            ))}
            {profile.links.length === 0 ? (
              <p className="text-sm text-white/50">Chưa có liên kết nào.</p>
            ) : null}
          </div>
        </Section>

        <Section
          title="Mạng xã hội"
          right={
            <button onClick={addSocial} className={addBtnCls}>
              <Plus className="h-4 w-4" /> Thêm
            </button>
          }
        >
          <div className="flex flex-col gap-2">
            {profile.socials.map((s) => (
              <div
                key={s.id}
                className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 flex items-center gap-2"
              >
                <select
                  value={s.platform}
                  onChange={(e) =>
                    updateSocial(s.id, { platform: e.target.value as SocialItem['platform'] })
                  }
                  className={`${inputBase} w-36 shrink-0`}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <input
                  value={s.url}
                  onChange={(e) => updateSocial(s.id, { url: e.target.value })}
                  placeholder="https:// hoặc mailto: / tel:"
                  className={`${inputBase} flex-1 min-w-0`}
                />
                <button
                  onClick={() => removeSocial(s.id)}
                  className={`${iconBtnCls} hover:text-red-400`}
                  aria-label="Xoá"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {profile.socials.length === 0 ? (
              <p className="text-sm text-white/50">Chưa có mạng xã hội nào.</p>
            ) : null}
          </div>
        </Section>

        <Section title="SEO / Metadata">
          <Field label="Page title">
            <input
              value={profile.meta.title}
              onChange={(e) => updateMeta({ title: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Meta description">
            <textarea
              value={profile.meta.description}
              onChange={(e) => updateMeta({ description: e.target.value })}
              rows={2}
              className={inputCls}
            />
          </Field>
        </Section>

        <div className="flex justify-end pt-4">
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand)] text-[var(--brand-fg)] font-semibold px-4 py-2.5 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </main>
  );
}

const inputBase =
  'rounded-lg bg-black/30 ring-1 ring-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--brand)] text-sm';

const inputCls = `w-full ${inputBase}`;

const addBtnCls =
  'inline-flex items-center gap-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-1.5';

const iconBtnCls =
  'h-9 w-9 grid place-items-center rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent';

function Section({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white/[0.03] ring-1 ring-white/10 p-5 flex flex-col gap-4">
      <header className="flex items-center">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">{title}</h2>
        {right ? <div className="ml-auto">{right}</div> : null}
      </header>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-white/70">{label}</span>
      {children}
    </label>
  );
}

function AvatarField({
  value,
  onChange,
  onError,
  onSessionExpired,
}: {
  value: string;
  onChange: (url: string) => void;
  onError: (msg: string) => void;
  onSessionExpired: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.status === 401) {
        onSessionExpired();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data?.error === 'file_too_large'
            ? 'File quá lớn (tối đa 4MB)'
            : data?.error === 'unsupported_type'
            ? 'Định dạng không hỗ trợ (chỉ nhận png/jpeg/webp/gif/svg)'
            : 'Upload thất bại';
        onError(msg);
        return;
      }
      const { url } = (await res.json()) as { url: string };
      onChange(url);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 rounded-full overflow-hidden ring-2 ring-white/10 bg-white/5 shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 px-3 py-2 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Đang tải…' : 'Tải ảnh lên'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={onFileChange}
          className="hidden"
        />
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="hoặc dán URL: https://… / /uploads/abc.png"
        className={inputCls}
      />
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 rounded-lg bg-transparent ring-1 ring-white/10 cursor-pointer"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  );
}
