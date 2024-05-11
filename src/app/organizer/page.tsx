'use client'

import { TournamentStore } from '@/lib/hooks/use-tournament-store';
import { observer } from 'mobx-react';

const OrganizerPage = () => {
  const tournament = new TournamentStore('OuFEd-CU3jhYKpP-e-SIk')
  console.log(tournament)
  return (
    <div>
      <pre>
        {/* {JSON.stringify(tournament, null, 2)} */}
      </pre>
    </div>
  );
}

export default  observer(OrganizerPage)
