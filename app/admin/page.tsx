import { readProfile } from '@/lib/profile';
import { AdminEditor } from '@/components/admin/AdminEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const profile = await readProfile();
  return <AdminEditor initial={profile} />;
}
