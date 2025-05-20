import NewTournamentForm from '@/app/tournaments/create/new-tournament-form';
import { validateRequest } from '@/lib/auth/lucia';
import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';

export default async function NewTournament() {
  const { user } = await validateRequest();
  if (!user) redirect('/sign-in?from=/tournaments/create');
  const userClubs = await publicCaller.user.authClubs();

  if (!user) redirect('/sign-in'); // Not sure if needed

  return (
    <div className="w-full">
      <NewTournamentForm clubs={userClubs} user={user} />
    </div>
  );
}
