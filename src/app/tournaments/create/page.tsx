import Loading from '@/app/tournaments/create/loading-form';
import NewTournamentForm from '@/app/tournaments/create/new-tournament-form';
import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function NewTournament() {
  const user = await publicCaller.user.auth.info();
  if (!user) redirect('/sign-in?from=/tournaments/create');
  const userClubs = await publicCaller.user.clubs({ userId: user.id });

  return (
    <Suspense fallback={<Loading />}>
      <NewTournamentForm clubs={userClubs} user={user} />
    </Suspense>
  );
}
