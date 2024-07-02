'use client';

import ClubPlayersList from '@/app/club/dashboard/players/club-players-list';
import { useUser } from '@/components/hooks/query-hooks/use-user';

export default function ClubDashboardPlayers() {
  const user = useUser();
  if (!user.data) return <></>;
  return <ClubPlayersList user={user.data} />;
}
