'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import type { ResourcesSection } from '@/lib/types';

export function ResourcesList({ resources }: { resources: ResourcesSection }) {
  const [page, setPage] = useState(0);
  const items = resources.items;
  const pageSize = Math.max(1, resources.pageSize || 5);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize;
  const visible = items.slice(start, start + pageSize);

  if (items.length === 0) return null;

  return (
    <section
      aria-label={resources.title}
      className="w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col gap-3"
    >
      <header className="px-1">
        <h2 className="text-sm font-semibold text-white/90">{resources.title}</h2>
      </header>

      <ul className="flex flex-col gap-2">
        {visible.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-tile flex items-center gap-3 rounded-2xl bg-black/30 hover:bg-black/40 ring-1 ring-white/10 px-3 py-2.5"
            >
              <span className="h-9 w-9 shrink-0 rounded-xl overflow-hidden bg-white/10 grid place-items-center">
                {item.iconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.iconUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Link2 className="h-4 w-4 text-white/70" aria-hidden />
                )}
              </span>
              <span className="text-sm font-medium text-white/95 truncate">{item.title}</span>
            </a>
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <footer className="flex items-center justify-between px-1 pt-1">
          <span className="text-xs text-white/50">
            Trang {safePage + 1} / {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Trang trước"
              className="h-8 w-8 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              aria-label="Trang sau"
              className="h-8 w-8 grid place-items-center rounded-lg bg-white/5 hover:bg-white/10 ring-1 ring-white/10 disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </footer>
      ) : null}
    </section>
  );
}
