import type { DonateSection } from '@/lib/types';

export function DonateBlock({ donate }: { donate: DonateSection }) {
  if (!donate.enabled || !donate.qrUrl) return null;

  return (
    <section
      aria-label={donate.title}
      className="w-full rounded-2xl bg-white/5 ring-1 ring-white/10 p-5 flex flex-col gap-4"
    >
      <header className="flex flex-col gap-2 px-1">
        <h2 className="text-base font-semibold text-white">{donate.title}</h2>
        {donate.subtitle ? (
          <div
            className="text-sm leading-relaxed text-white/80 whitespace-pre-line [&_a]:underline [&_a]:text-white"
            dangerouslySetInnerHTML={{ __html: donate.subtitle }}
          />
        ) : null}
      </header>
      <div className="grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={donate.qrUrl}
          alt={donate.title}
          className="w-full max-w-[220px] h-auto rounded-xl"
          loading="lazy"
        />
      </div>
    </section>
  );
}
