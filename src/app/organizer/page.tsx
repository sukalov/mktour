'use client';

import { useTournamentStore } from '@/lib/hooks/use-tournament-store';

const OrganizerPage = () => {
  const tournament = useTournamentStore();
  console.log(tournament);
  return (
    <div>
      <pre>{JSON.stringify(tournament, null, 2)}</pre>
      <br />
      {/* <button onClick={() => tournament.addPlayer('')}>dsf;lsdjf;ls</button> */}
    </div>
  );
};

export default OrganizerPage;
