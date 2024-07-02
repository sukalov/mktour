import ClubPlayersList from '@/app/club/dashboard/players/club-players-list';
import { validateRequest } from '@/lib/auth/lucia';

export default async function ClubDashboardPlayers() {
  const { user } = await validateRequest();
  if (!user) return <></>;
  return <ClubPlayersList userId={user.id} />;
}
