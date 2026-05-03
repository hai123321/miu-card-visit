import Image from 'next/image';
import { SocialIcon } from './SocialIcon';
import { ResourcesList } from './ResourcesList';
import { DonateBlock } from './DonateBlock';
import type { Profile } from '@/lib/types';

export function ProfileCard({ profile }: { profile: Profile }) {
  const themeStyle = {
    '--brand': profile.theme.main,
    '--brand-fg': profile.theme.mainText,
    '--bg': profile.theme.background,
  } as React.CSSProperties;

  const bgClass =
    profile.theme.style === 'gradient'
      ? 'bg-[radial-gradient(circle_at_top,_color-mix(in_oklab,_var(--brand)_22%,_var(--bg)),_var(--bg)_60%)]'
      : 'bg-[var(--bg)]';

  return (
    <main
      style={themeStyle}
      className={`min-h-dvh ${bgClass} text-white flex justify-center px-5 py-10 sm:py-14`}
    >
      <div className="w-full max-w-md flex flex-col items-center gap-7">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full pulse-ring" aria-hidden />
            <div className="relative h-28 w-28 rounded-full overflow-hidden ring-4 ring-[color-mix(in_oklab,_var(--brand)_70%,_transparent)] bg-white/5">
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-3xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
            {profile.handle ? (
              <p className="text-sm text-white/60">@{profile.handle}</p>
            ) : null}
          </div>

          {profile.bio ? (
            <p className="text-[0.95rem] leading-relaxed text-white/80 max-w-xs">
              {profile.bio}
            </p>
          ) : null}
        </header>

        {profile.socials.length > 0 ? (
          <nav aria-label="Social links" className="flex flex-wrap items-center justify-center gap-2.5">
            {profile.socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label || s.platform}
                className="link-tile h-10 w-10 grid place-items-center rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10"
              >
                <SocialIcon platform={s.platform} className="h-5 w-5" />
              </a>
            ))}
          </nav>
        ) : null}

        <section aria-label="Links" className="w-full flex flex-col gap-3">
          {profile.links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`link-tile w-full text-center font-semibold rounded-2xl px-5 py-4 ${
                l.highlight
                  ? 'bg-[var(--brand)] text-[var(--brand-fg)] shadow-[0_8px_24px_-8px_color-mix(in_oklab,_var(--brand)_70%,_transparent)]'
                  : 'bg-white/5 hover:bg-white/10 ring-1 ring-white/10'
              }`}
            >
              {l.title}
            </a>
          ))}
        </section>

        <ResourcesList resources={profile.resources} />

        <DonateBlock donate={profile.donate} />

        <footer className="mt-auto pt-6 text-xs text-white/40">
          <a href="/admin" className="hover:text-white/70 transition-colors">
            Admin
          </a>
        </footer>
      </div>
    </main>
  );
}
