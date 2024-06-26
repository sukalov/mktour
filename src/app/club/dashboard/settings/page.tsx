'use client';

import ClubSettingsForm from '@/app/club/dashboard/settings/club-settings-form';
import { useUser } from '@/components/hooks/query-hooks/use-user';

export default function ClubSettings() {
  const user = useUser();
  if (!user.data) return <></>;
  return <ClubSettingsForm user={user.data} />;
}
