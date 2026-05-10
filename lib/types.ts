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

export type ResourceItem = {
  id: string;
  title: string;
  url: string;
  iconUrl?: string;
  series?: string;
};

export type ResourcesSection = {
  title: string;
  pageSize: number;
  items: ResourceItem[];
};

export type DonateMethod = {
  id: string;
  label: string;
  accountInfo: string;
  qrUrl: string;
};

export type DonatePerk = {
  id: string;
  title: string;
  description: string;
};

export type DonateSection = {
  enabled: boolean;
  title: string;
  subtitle: string;
  methods: DonateMethod[];
  perks: DonatePerk[];
  qrUrl?: string;
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
  resources: ResourcesSection;
  donate: DonateSection;
  meta: {
    title: string;
    description: string;
  };
};
