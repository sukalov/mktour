import { validateRequest } from '@/lib/auth/lucia';
import ClubSettingsForm from 'archive/dashboard/settings/club-settings-form';
import { redirect } from 'next/navigation';

export default async function ClubSettings() {
  const { user } = await validateRequest();
  if (!user) redirect('/club/all');
  return <ClubSettingsForm userId={user.id} />;
}
