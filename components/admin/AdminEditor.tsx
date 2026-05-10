'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, GripVertical, ArrowUp, ArrowDown,
  LogOut, Save, Eye,
} from 'lucide-react';
import type {
  DonateMethod,
  DonatePerk,
  LinkItem,
  Profile,
  ResourceItem,
  SocialItem,
} from '@/lib/types';
import { ImageUpload } from './ImageUpload';
import { RichText } from './RichText';

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

  function updateResources(patch: Partial<Profile['resources']>) {
    setProfile((p) => ({ ...p, resources: { ...p.resources, ...patch } }));
  }

  function updateResourceItem(id: string, patch: Partial<ResourceItem>) {
    setProfile((p) => ({
      ...p,
      resources: {
        ...p.resources,
        items: p.resources.items.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      },
    }));
  }

  function moveResource(id: string, dir: -1 | 1) {
    setProfile((p) => {
      const items = p.resources.items;
      const idx = items.findIndex((r) => r.id === id);
      if (idx < 0) return p;
      const next = [...items];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return p;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return { ...p, resources: { ...p.resources, items: next } };
    });
  }

  function addResource() {
    setProfile((p) => ({
      ...p,
      resources: {
        ...p.resources,
        items: [...p.resources.items, { id: uid(), title: 'Tài liệu mới', url: 'https://' }],
      },
    }));
  }

  function removeResource(id: string) {
    setProfile((p) => ({
      ...p,
      resources: { ...p.resources, items: p.resources.items.filter((r) => r.id !== id) },
    }));
  }

  function updateDonate(patch: Partial<Profile['donate']>) {
    setProfile((p) => ({ ...p, donate: { ...p.donate, ...patch } }));
  }

  function updateDonateMethod(id: string, patch: Partial<DonateMethod>) {
    setProfile((p) => ({
      ...p,
      donate: {
        ...p.donate,
        methods: (p.donate.methods ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
      },
    }));
  }

  function moveDonateMethod(id: string, dir: -1 | 1) {
    setProfile((p) => {
      const list = [...(p.donate.methods ?? [])];
      const idx = list.findIndex((m) => m.id === id);
      if (idx < 0) return p;
      const swap = idx + dir;
      if (swap < 0 || swap >= list.length) return p;
      [list[idx], list[swap]] = [list[swap], list[idx]];
      return { ...p, donate: { ...p.donate, methods: list } };
    });
  }

  function addDonateMethod() {
    setProfile((p) => ({
      ...p,
      donate: {
        ...p.donate,
        methods: [
          ...(p.donate.methods ?? []),
          { id: uid(), label: 'Banking', accountInfo: '', qrUrl: '' },
        ],
      },
    }));
  }

  function removeDonateMethod(id: string) {
    setProfile((p) => ({
      ...p,
      donate: {
        ...p.donate,
        methods: (p.donate.methods ?? []).filter((m) => m.id !== id),
      },
    }));
  }

  function updateDonatePerk(id: string, patch: Partial<DonatePerk>) {
    setProfile((p) => ({
      ...p,
      donate: {
        ...p.donate,
        perks: (p.donate.perks ?? []).map((k) => (k.id === id ? { ...k, ...patch } : k)),
      },
    }));
  }

  function moveDonatePerk(id: string, dir: -1 | 1) {
    setProfile((p) => {
      const list = [...(p.donate.perks ?? [])];
      const idx = list.findIndex((m) => m.id === id);
      if (idx < 0) return p;
      const swap = idx + dir;
      if (swap < 0 || swap >= list.length) return p;
      [list[idx], list[swap]] = [list[swap], list[idx]];
      return { ...p, donate: { ...p.donate, perks: list } };
    });
  }

  function addDonatePerk() {
    setProfile((p) => ({
      ...p,
      donate: {
        ...p.donate,
        perks: [
          ...(p.donate.perks ?? []),
          { id: uid(), title: 'Quà tặng mới', description: '' },
        ],
      },
    }));
  }

  function removeDonatePerk(id: string) {
    setProfile((p) => ({
      ...p,
      donate: { ...p.donate, perks: (p.donate.perks ?? []).filter((k) => k.id !== id) },
    }));
  }

  const seriesSuggestions = useMemo(() => {
    const set = new Set<string>();
    for (const r of profile.resources.items) {
      const s = r.series?.trim();
      if (s) set.add(s);
    }
    return Array.from(set);
  }, [profile.resources.items]);

  const sessionExpired = () => {
    setError('Phiên đăng nhập đã hết hạn. Đang chuyển hướng…');
    setTimeout(() => router.replace('/admin/login'), 800);
  };

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
      <datalist id="series-suggestions">
        {seriesSuggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
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
            <ImageUpload
              value={profile.avatarUrl}
              onChange={(v) => update('avatarUrl', v)}
              onError={setError}
              onSessionExpired={sessionExpired}
              size={64}
              shape="circle"
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

        <Section
          title="Tài liệu / Tool"
          right={
            <button onClick={addResource} className={addBtnCls}>
              <Plus className="h-4 w-4" /> Thêm
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tiêu đề section">
              <input
                value={profile.resources.title}
                onChange={(e) => updateResources({ title: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Số bài / trang">
              <input
                type="number"
                min={1}
                max={20}
                value={profile.resources.pageSize}
                onChange={(e) =>
                  updateResources({ pageSize: Math.max(1, Number(e.target.value) || 5) })
                }
                className={inputCls}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-2">
            {profile.resources.items.map((r, i) => (
              <div
                key={r.id}
                className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-white/40 shrink-0" />
                  <input
                    value={r.title}
                    onChange={(e) => updateResourceItem(r.id, { title: e.target.value })}
                    placeholder="Tiêu đề tài liệu"
                    className={`${inputBase} flex-1 min-w-0`}
                  />
                  <div className="flex shrink-0">
                    <button
                      onClick={() => moveResource(r.id, -1)}
                      disabled={i === 0}
                      className={iconBtnCls}
                      aria-label="Lên"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveResource(r.id, 1)}
                      disabled={i === profile.resources.items.length - 1}
                      className={iconBtnCls}
                      aria-label="Xuống"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeResource(r.id)}
                      className={`${iconBtnCls} hover:text-red-400`}
                      aria-label="Xoá"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <input
                  value={r.url}
                  onChange={(e) => updateResourceItem(r.id, { url: e.target.value })}
                  placeholder="https://drive.google.com/…"
                  className={inputCls}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Series (gom nhóm, tùy chọn)">
                    <input
                      value={r.series ?? ''}
                      onChange={(e) => updateResourceItem(r.id, { series: e.target.value })}
                      placeholder="Ví dụ: Khoá học AI, Tools…"
                      list="series-suggestions"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Icon (tùy chọn)">
                    <ImageUpload
                      value={r.iconUrl ?? ''}
                      onChange={(v) => updateResourceItem(r.id, { iconUrl: v })}
                      onError={setError}
                      onSessionExpired={sessionExpired}
                      size={40}
                      shape="rounded"
                      buttonLabel="Tải icon"
                      showUrlField={false}
                      enableLibrary
                    />
                  </Field>
                </div>
              </div>
            ))}
            {profile.resources.items.length === 0 ? (
              <p className="text-sm text-white/50">Chưa có tài liệu nào.</p>
            ) : null}
          </div>
        </Section>

        <Section title="Donate">
          <label className="inline-flex items-center gap-2 text-sm text-white/80">
            <input
              type="checkbox"
              checked={profile.donate.enabled}
              onChange={(e) => updateDonate({ enabled: e.target.checked })}
              className="accent-[var(--brand)]"
            />
            Hiển thị block donate trên trang public
          </label>
          <Field label="Tiêu đề">
            <input
              value={profile.donate.title}
              onChange={(e) => updateDonate({ title: e.target.value })}
              placeholder="Tặng mình 1 ly cafe nha!"
              className={inputCls}
            />
          </Field>
          <Field label="Mô tả ngắn (intro, hỗ trợ HTML)">
            <RichText
              value={profile.donate.subtitle}
              onChange={(html) => updateDonate({ subtitle: html })}
              placeholder="Vài dòng giải thích vì sao có block này…"
            />
          </Field>

          <div className="rounded-xl ring-1 ring-white/10 p-4 flex flex-col gap-3">
            <div className="flex items-center">
              <h3 className="text-sm font-semibold text-white/80">Quyền lợi cho người donate</h3>
              <button onClick={addDonatePerk} className={`${addBtnCls} ml-auto`}>
                <Plus className="h-4 w-4" /> Thêm quyền lợi
              </button>
            </div>
            <p className="text-xs text-white/50">
              Liệt kê rõ với 1 ly cafe người ủng hộ nhận lại được gì.
            </p>
            <div className="flex flex-col gap-2">
              {(profile.donate.perks ?? []).map((perk, i) => (
                <div
                  key={perk.id}
                  className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-white/40 shrink-0" />
                    <input
                      value={perk.title}
                      onChange={(e) => updateDonatePerk(perk.id, { title: e.target.value })}
                      placeholder="Tiêu đề quyền lợi"
                      className={`${inputBase} flex-1 min-w-0`}
                    />
                    <div className="flex shrink-0">
                      <button
                        onClick={() => moveDonatePerk(perk.id, -1)}
                        disabled={i === 0}
                        className={iconBtnCls}
                        aria-label="Lên"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveDonatePerk(perk.id, 1)}
                        disabled={i === (profile.donate.perks ?? []).length - 1}
                        className={iconBtnCls}
                        aria-label="Xuống"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeDonatePerk(perk.id)}
                        className={`${iconBtnCls} hover:text-red-400`}
                        aria-label="Xoá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={perk.description}
                    onChange={(e) => updateDonatePerk(perk.id, { description: e.target.value })}
                    placeholder="Mô tả ngắn (vd: 1 series khoá học người thật việc thật do mình tự làm)"
                    rows={2}
                    className={inputCls}
                  />
                </div>
              ))}
              {(profile.donate.perks ?? []).length === 0 ? (
                <p className="text-sm text-white/50">Chưa có quyền lợi nào.</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl ring-1 ring-white/10 p-4 flex flex-col gap-3">
            <div className="flex items-center">
              <h3 className="text-sm font-semibold text-white/80">Phương thức donate</h3>
              <button onClick={addDonateMethod} className={`${addBtnCls} ml-auto`}>
                <Plus className="h-4 w-4" /> Thêm kênh
              </button>
            </div>
            <p className="text-xs text-white/50">
              Mỗi kênh có 1 nhãn (PayPal, MoMo, ZaloPay, Banking…), thông tin tài khoản và ảnh QR riêng.
            </p>
            <div className="flex flex-col gap-3">
              {(profile.donate.methods ?? []).map((method, i) => (
                <div
                  key={method.id}
                  className="rounded-xl bg-white/5 ring-1 ring-white/10 p-3 flex flex-col gap-3"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-white/40 shrink-0" />
                    <input
                      value={method.label}
                      onChange={(e) => updateDonateMethod(method.id, { label: e.target.value })}
                      placeholder="Nhãn (PayPal, MoMo, ZaloPay…)"
                      className={`${inputBase} flex-1 min-w-0`}
                    />
                    <div className="flex shrink-0">
                      <button
                        onClick={() => moveDonateMethod(method.id, -1)}
                        disabled={i === 0}
                        className={iconBtnCls}
                        aria-label="Lên"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveDonateMethod(method.id, 1)}
                        disabled={i === (profile.donate.methods ?? []).length - 1}
                        className={iconBtnCls}
                        aria-label="Xuống"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeDonateMethod(method.id)}
                        className={`${iconBtnCls} hover:text-red-400`}
                        aria-label="Xoá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <Field label="Thông tin tài khoản (hỗ trợ HTML)">
                    <RichText
                      value={method.accountInfo}
                      onChange={(html) => updateDonateMethod(method.id, { accountInfo: html })}
                      placeholder="STK / số điện thoại / email PayPal…"
                    />
                  </Field>
                  <Field label="Ảnh QR">
                    <ImageUpload
                      value={method.qrUrl}
                      onChange={(v) => updateDonateMethod(method.id, { qrUrl: v })}
                      onError={setError}
                      onSessionExpired={sessionExpired}
                      size={120}
                      shape="rounded"
                      buttonLabel="Tải QR lên"
                      enableLibrary
                    />
                  </Field>
                </div>
              ))}
              {(profile.donate.methods ?? []).length === 0 ? (
                <p className="text-sm text-white/50">Chưa có phương thức nào.</p>
              ) : null}
            </div>
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
