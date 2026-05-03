import {
  Facebook,
  Instagram,
  Github,
  Linkedin,
  Youtube,
  Twitter,
  Mail,
  Phone,
  Globe,
  Music2,
  type LucideIcon,
} from 'lucide-react';
import type { SocialItem } from '@/lib/types';

const ICONS: Record<SocialItem['platform'], LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music2,
  twitter: Twitter,
  email: Mail,
  phone: Phone,
  website: Globe,
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialItem['platform'];
  className?: string;
}) {
  const Icon = ICONS[platform] ?? Globe;
  return <Icon className={className} aria-hidden />;
}
