import TournamentItemIteratee from '@/components/tournament-item';
import { publicCaller } from '@/server/api';

import { Suspense } from 'react';

export default async function Tournaments() {
  const allTournaments = await publicCaller.tournament.all();

  return (
    <main className="mk-container mk-list">
      <Suspense fallback={<p>loading all tournaments...</p>}>
        {allTournaments.map((props) => (
          <TournamentItemIteratee key={props.tournament.id} {...props} />
        ))}
      </Suspense>
    </main>
  );
}
