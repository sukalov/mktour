import TournamentItemIteratee from '@/components/tournament-item';
import TournamentsAllCache from '@/components/tournament-item-cache';
import { publicCaller } from '@/server/api';

import { Suspense } from 'react';

export default async function Tournaments() {
  const allTournaments = await publicCaller.tournament.all();

  return (
    <main className="mk-container mk-list">
      <Suspense fallback={<TournamentsAllCache />}>
        {allTournaments.map((props) => (
          <TournamentItemIteratee key={props.tournament.id} {...props} />
        ))}
      </Suspense>
    </main>
  );
}
