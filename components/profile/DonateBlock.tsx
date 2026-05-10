'use client';

import { useState } from 'react';
import { Coffee } from 'lucide-react';
import type { DonateSection } from '@/lib/types';

export function DonateBlock({ donate }: { donate: DonateSection }) {
  const methods = donate.methods ?? [];
  const [activeId, setActiveId] = useState<string>(methods[0]?.id ?? '');

  if (!donate.enabled) return null;
  if (methods.length === 0) return null;

  const active = methods.find((m) => m.id === activeId) ?? methods[0];

  return (
    <section
      aria-label={donate.title}
      className="w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 flex flex-col gap-4"
    >
      <header className="flex flex-col gap-2 px-1">
        <h2 className="text-base font-semibold text-white">{donate.title}</h2>
        {donate.subtitle ? (
          <div
            className="text-sm leading-relaxed text-white/80 [&_a]:underline [&_a]:text-white"
            dangerouslySetInnerHTML={{ __html: donate.subtitle }}
          />
        ) : null}
      </header>

      {donate.perks && donate.perks.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {donate.perks.map((p) => (
            <li
              key={p.id}
              className="flex items-start gap-3 rounded-xl bg-black/30 ring-1 ring-white/10 px-3 py-2.5"
            >
              <span className="h-7 w-7 shrink-0 grid place-items-center rounded-full bg-[var(--brand)]/20 text-[var(--brand)]">
                <Coffee className="h-3.5 w-3.5" aria-hidden />
              </span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-semibold text-white/95">{p.title}</span>
                {p.description ? (
                  <span className="text-xs text-white/70 leading-relaxed">{p.description}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {methods.length > 1 ? (
        <div role="tablist" aria-label="Phương thức donate" className="flex flex-wrap gap-1.5">
          {methods.map((m) => {
            const selected = m.id === active.id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={selected}
                type="button"
                onClick={() => setActiveId(m.id)}
                className={`text-xs font-semibold rounded-full px-3 py-1.5 transition ${
                  selected
                    ? 'bg-[var(--brand)] text-[var(--brand-fg)]'
                    : 'bg-white/5 ring-1 ring-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                {m.label || 'QR'}
              </button>
            );
          })}
        </div>
      ) : null}

      {active.accountInfo ? (
        <div
          className="text-sm leading-relaxed text-white/80 [&_a]:underline [&_a]:text-white px-1"
          dangerouslySetInnerHTML={{ __html: active.accountInfo }}
        />
      ) : null}

      {active.qrUrl ? (
        <div className="grid place-items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.qrUrl}
            alt={`${donate.title} — ${active.label}`}
            className="w-full max-w-[220px] h-auto rounded-xl"
            loading="lazy"
          />
        </div>
      ) : null}
    </section>
  );
}
