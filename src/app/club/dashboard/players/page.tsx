import ClubPlayersList from '@/app/club/dashboard/players/club-players-list';
import { getUser } from '@/lib/auth/utils';
import usePlayersToClubQuery from '@/lib/db/hooks/use-players-to-club-query';

export default async function ClubDashboardPlayers() {
  const user = await getUser();
  const players = await usePlayersToClubQuery(user);

  return <ClubPlayersList players={players} />;
}
