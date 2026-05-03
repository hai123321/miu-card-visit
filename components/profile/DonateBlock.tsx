import type { DonateSection } from '@/lib/types';

export function DonateBlock({ donate }: { donate: DonateSection }) {
  if (!donate.enabled || !donate.qrUrl) return null;

  return (
    <section
      aria-label={donate.title}
      className="w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 flex flex-col gap-3"
    >
      <header className="px-1">
        <h2 className="text-sm font-semibold text-white/95">{donate.title}</h2>
        {donate.subtitle ? (
          <p className="mt-1 text-xs leading-relaxed text-white/60 whitespace-pre-line">
            {donate.subtitle}
          </p>
        ) : null}
      </header>
      <div className="rounded-2xl bg-white p-4 grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={donate.qrUrl}
          alt={donate.title}
          className="max-w-full h-auto"
          loading="lazy"
        />
      </div>
    </section>
  );
}
