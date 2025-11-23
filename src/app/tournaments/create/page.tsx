import NewTournamentForm from '@/app/tournaments/create/new-tournament-form';
import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';

export default async function NewTournament() {
  const user = await publicCaller.auth.info();
  if (!user) redirect('/sign-in?from=/tournaments/create');
  const userClubs = await publicCaller.user.clubs({ userId: user.id });

  return <NewTournamentForm clubs={userClubs} user={user} />;
}
