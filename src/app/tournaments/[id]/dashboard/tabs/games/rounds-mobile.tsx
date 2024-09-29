'use client';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import RoundControls from '@/app/tournaments/[id]/dashboard/tabs/games/round-controls';
import RoundItem from '@/app/tournaments/[id]/dashboard/tabs/games/round-item';
import Center from '@/components/center';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import SkeletonList from '@/components/skeleton-list';
import { useMutationState } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { FC, useContext, useState } from 'react';

const RoundsMobile: FC = () => {
  const [roundInView, setRoundInView] = useState(1);
  const { currentTab } = useContext(DashboardContext);
  const id = usePathname().split('/').at(-1) as string;
  const { data, isError, isLoading } = useTournamentInfo(id);
  const {
    data: players,
    isLoading: isPlayersloading,
    isError: isPlayersError,
  } = useTournamentPlayers(id);
  const mutations = useMutationState({
    filters: { status: 'pending' },
  });

  if (isError || isPlayersError) {
    return (
      <div>
        <RoundControls
          roundInView={roundInView}
          setRoundInView={setRoundInView}
          currentRound={1}
          currentTab={currentTab}
        />
      </div>
    );
  }
  if (isLoading || isPlayersloading || mutations.length > 1) {
    return (
      <div>
        <RoundControls
          roundInView={roundInView}
          setRoundInView={setRoundInView}
          currentRound={1}
          currentTab={currentTab}
        />
        <div className="pt-12 px-4">
          <SkeletonList length={8} height={12} />
        </div>
      </div>
    );
  }
  if (!players || players.length < 2)
    return <Center>{'add at least two players to see generated round'}</Center>; // FIXME Intl

  if (!data) return 'no data'; // FIXME Intl

  return (
    <div>
      <RoundControls
        roundInView={roundInView}
        setRoundInView={setRoundInView}
        currentRound={data.tournament.ongoing_round}
        currentTab={currentTab}
      />
      <RoundItem roundNumber={roundInView} />
    </div>
  );
};

export default RoundsMobile;
