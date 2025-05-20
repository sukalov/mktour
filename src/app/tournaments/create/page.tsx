import NewTournamentForm from '@/app/tournaments/create/new-tournament-form';
import { validateRequest } from '@/lib/auth/lucia';
import getUserToClubs from '@/server/db/queries/get-user-to-clubs';
import { DatabaseClub } from '@/server/db/schema/clubs';
import { redirect } from 'next/navigation';

export default async function NewTournament() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in?from=/tournaments/create');
  const userClubs = await getUserToClubs({ user });
  const preparedUser = userClubs.map((el) => el.club) as DatabaseClub[];

  if (!user) redirect('/sign-in'); // Not sure if needed

  return (
    <div className="w-full">
      <NewTournamentForm clubs={preparedUser} user={user} />
    </div>
  );
}
