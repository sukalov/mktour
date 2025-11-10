import NewTournamentForm from '@/app/tournaments/create/new-tournament-form';
import { publicCaller } from '@/server/api';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function NewTournament() {
  const user = await publicCaller.user.auth();
  if (!user) redirect('/sign-in?from=/tournaments/create');
  const userClubs = await publicCaller.user.clubs({ userId: user.id });

  return (
    <Suspense fallback={<p>LOADING MAKE TOURNAMENN PAGE ...</p>}>
      <div className="w-full">
        <NewTournamentForm clubs={userClubs} user={user} />
      </div>
    </Suspense>
  );
}
