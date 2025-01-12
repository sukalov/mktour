import { emptyClubCheck } from '@/app/clubs/create/empty-club-check';
import ForwardToEmpryClub from '@/app/clubs/create/forward-to-empty-club';
import NewClubForm, { TeamSlice } from '@/app/clubs/create/new-club-form';
import { validateRequest } from '@/lib/auth/lucia';
import { Team } from '@/types/lichess-api';
import { redirect } from 'next/navigation';

export default async function CreateClubPage() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in');
  const club = await emptyClubCheck({ user });
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
    console.log(`ERROR: unable to connect to lichess.  ${e}`);
  }

  return (
    <div>
      {club ? (
        <ForwardToEmpryClub club={club} userId={user.id} />
      ) : (
        <NewClubForm user={user} teams={teams} />
      )}
    </div>
  );
}
