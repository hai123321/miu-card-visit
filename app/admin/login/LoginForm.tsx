'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/admin';

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error === 'invalid_credentials' ? 'Sai mật khẩu' : 'Đăng nhập thất bại');
        return;
      }
      router.replace(next);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-[#0F0F12] text-white px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 flex flex-col gap-4"
      >
        <h1 className="text-xl font-bold tracking-tight">Đăng nhập admin</h1>
        <p className="text-sm text-white/60">Nhập mật khẩu để chỉnh sửa trang.</p>

        <label className="flex flex-col gap-2 text-sm">
          <span className="text-white/70">Mật khẩu</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="rounded-lg bg-black/30 ring-1 ring-white/10 px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#FB2D5A]"
          />
        </label>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#FB2D5A] text-white font-semibold py-2.5 disabled:opacity-50"
        >
          {pending ? 'Đang xử lý…' : 'Đăng nhập'}
        </button>

        <a href="/" className="text-center text-xs text-white/50 hover:text-white/80 transition-colors">
          ← Về trang chính
        </a>
      </form>
    </main>
  );
}
