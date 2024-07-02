import ClubSettingsForm from '@/app/club/dashboard/settings/club-settings-form';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function ClubSettings() {
  const { user } = await validateRequest();
  if (!user) redirect('/club/all');
  return <ClubSettingsForm userId={user.id} />;
}
