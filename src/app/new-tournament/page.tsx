import NewTournamentForm from '@/app/new-tournament/new-tournament-form';
import { getUser } from '@/lib/auth/utils';
import useUserToClubsQuery from '@/lib/db/hooks/useUserToClubsQuery';
import { DatabaseClub } from '@/lib/db/schema/tournaments';
import { redirect } from 'next/navigation';

export default async function NewTournament() {
  const user = await getUser(); // TODO: Create Context for user object!
  const userClubs = await useUserToClubsQuery({ user });
  const preparedUser = userClubs.map((el) => el.club) as DatabaseClub[];

  if (!user) redirect('/sign-in'); // Not sure if needed

  return (
    <div className="w-full">
      <NewTournamentForm clubs={preparedUser} user={user} />
    </div>
  );
}
