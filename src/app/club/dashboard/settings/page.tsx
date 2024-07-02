import ClubSettingsForm from '@/app/club/dashboard/settings/club-settings-form';
import { validateRequest } from '@/lib/auth/lucia';

export default async function ClubSettings() {
  const { user } = await validateRequest();
  if (!user) return <></>;
  return <ClubSettingsForm user={user} />;
}
