import ClubPlayersList from '@/app/club/dashboard/players/club-players-list';
import { validateRequest } from '@/lib/auth/lucia';
import { redirect } from 'next/navigation';

export default async function ClubDashboardPlayers() {
  const { user } = await validateRequest();
  if (!user) redirect('/club/all');
  return <ClubPlayersList userId={user.id} />;
}
