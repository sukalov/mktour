import NewClubForm, { TeamSlice } from '@/app/club/create/new-club-form';
import { getUser } from '@/lib/auth/utils';
import useUserToClubsQuery from '@/lib/db/hooks/use-user-to-clubs-query';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { Team } from '@/types/lichess-api';
import { redirect } from 'next/navigation';

export default async function CreateClubPage() {
  const user = await getUser();
  if (!user) redirect('/sign-in');
  const userClubs = await useUserToClubsQuery({ user });
  const preparedUser = userClubs.map((el) => el.club) as DatabaseClub[];
  let teams: Array<TeamSlice> = [];
  try {
    const res = await fetch(`https://lichess.org/api/team/of/${user.username}`);
    const teamsFull = (await res.json()) as Array<Team>;
    teams = teamsFull
      .filter((team) =>
        team.leaders.find((leader) => leader.id === user.username),
      )
      .map((el) => ({
        label: el.name.toLowerCase(),
        value: el.id,
      }));
  } catch (e) {
    console.log('ERROR: unable to connect to lichess');
  }

  return (
    <div>
      <NewClubForm user={user} clubs={preparedUser} teams={teams} />
    </div>
  );
}
