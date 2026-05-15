import { readProfile } from '@/lib/profile';
import { ProfileCard } from '@/components/profile/ProfileCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const profile = await readProfile();
  return <ProfileCard profile={profile} />;
}
