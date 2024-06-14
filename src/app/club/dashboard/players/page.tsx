import ClubPlayersList from '@/app/club/dashboard/players/club-players-list';
import { validateRequest } from '@/lib/auth/lucia';
import usePlayersToClubQuery from '@/lib/db/hooks/use-players-to-club-query';
import { redirect } from 'next/navigation';

export default async function ClubDashboardPlayers() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in')
  const players = await usePlayersToClubQuery(user);

  return <ClubPlayersList players={players} />;
}
