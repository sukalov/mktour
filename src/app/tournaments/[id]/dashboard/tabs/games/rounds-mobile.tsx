'use client';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import RoundControls from '@/app/tournaments/[id]/dashboard/tabs/games/round-controls';
import RoundItem from '@/app/tournaments/[id]/dashboard/tabs/games/round-item';
import Center from '@/components/center';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { usePathname } from 'next/navigation';
import { FC, useContext, useState } from 'react';

const RoundsMobile: FC = () => {
  const [roundInView, setRoundInView] = useState(1);
  const { currentTab } = useContext(DashboardContext);
  const id = usePathname().split('/').at(-1) as string;
  const { data, isError } = useTournamentInfo(id);
  const { data: players, isError: isPlayersError } = useTournamentPlayers(id);

  if (!players || players.length < 2)
    return <Center>{'add at least two players to see generated round'}</Center>; // FIXME Intl

  if (isError || isPlayersError) return 'error'; // FIXME Intl
  if (!data) return 'loading'; // FIXME Intl

  return (
    <div>
      <RoundControls
        roundInView={roundInView}
        setRoundInView={setRoundInView}
        currentRound={data.tournament.ongoing_round}
        currentTab={currentTab}
      />
      <div className="mt-14 flex w-full flex-col gap-4 px-4">
        <RoundItem roundNumber={roundInView} />
      </div>
    </div>
  );
};

export default RoundsMobile;
