'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Link2 } from 'lucide-react';
import type { ResourcesSection } from '@/lib/types';

const ALL = '__all__';

export function ResourcesList({ resources }: { resources: ResourcesSection }) {
  const items = resources.items;
  const pageSize = Math.max(1, resources.pageSize || 5);

  const seriesList = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      const s = item.series?.trim();
      if (s) set.add(s);
    }
    return Array.from(set);
  }, [items]);

  const [activeSeries, setActiveSeries] = useState<string>(ALL);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (activeSeries === ALL) return items;
    return items.filter((i) => (i.series ?? '') === activeSeries);
  }, [items, activeSeries]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const start = safePage * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  if (items.length === 0) return null;

  function selectSeries(s: string) {
    setActiveSeries(s);
    setPage(0);
  }

  return (
    <section
      aria-label={resources.title}
      className="w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col gap-3"
    >
      <header className="px-1 flex items-center gap-2">
        <h2 className="text-sm font-semibold text-white/90">{resources.title}</h2>
      </header>

      {seriesList.length > 0 ? (
        <div role="tablist" aria-label="Series" className="flex flex-wrap gap-1.5 px-1">
          <SeriesChip
            label="Tất cả"
            selected={activeSeries === ALL}
            onClick={() => selectSeries(ALL)}
          />
          {seriesList.map((s) => (
            <SeriesChip
              key={s}
              label={s}
              selected={activeSeries === s}
              onClick={() => selectSeries(s)}
            />
          ))}
        </div>
      ) : null}

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
              <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white/95 truncate">{item.title}</span>
                {activeSeries === ALL && item.series ? (
                  <span className="text-[11px] text-white/50 truncate">{item.series}</span>
                ) : null}
              </span>
            </a>
          </li>
        ))}
      </ul>

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
    </section>
  );
}

function SeriesChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`text-xs font-medium rounded-full px-2.5 py-1 transition ${
        selected
          ? 'bg-[var(--brand)] text-[var(--brand-fg)]'
          : 'bg-white/5 ring-1 ring-white/10 text-white/80 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  );
}
