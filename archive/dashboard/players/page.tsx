import { validateRequest } from '@/lib/auth/lucia';
import ClubPlayersList from 'archive/dashboard/players/club-players-list';
import { redirect } from 'next/navigation';

export default async function ClubDashboardPlayers() {
  const { user } = await validateRequest();
  if (!user) redirect('/clubs/all');
  return <ClubPlayersList userId={user.id} />;
}
