export type LinkItem = {
  id: string;
  title: string;
  url: string;
  icon?: string;
  highlight?: boolean;
};

export type SocialItem = {
  id: string;
  platform:
    | 'facebook'
    | 'instagram'
    | 'github'
    | 'linkedin'
    | 'youtube'
    | 'tiktok'
    | 'twitter'
    | 'email'
    | 'phone'
    | 'website';
  url: string;
  label?: string;
};

export type Profile = {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  coverUrl?: string;
  theme: {
    main: string;
    mainText: string;
    background: string;
    style: 'gradient' | 'solid';
  };
  links: LinkItem[];
  socials: SocialItem[];
  meta: {
    title: string;
    description: string;
  };
};
