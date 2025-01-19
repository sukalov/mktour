'use client';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import RoundControls from '@/app/tournaments/[id]/dashboard/tabs/games/round-controls';
import RoundItem from '@/app/tournaments/[id]/dashboard/tabs/games/round-item';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import Overlay from '@/components/overlay';
import SkeletonList from '@/components/skeleton-list';
import { useMutationState } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, useContext } from 'react';

const RoundsMobile: FC = () => {
  const { currentTab, roundInView, setRoundInView } =
    useContext(DashboardContext);
  const { id } = useParams<{ id: string }>();
  const { data, isError, isLoading } = useTournamentInfo(id);
  const {
    data: players,
    isLoading: isPlayersloading,
    isError: isPlayersError,
  } = useTournamentPlayers(id);
  const mutations = useMutationState({
    filters: { status: 'pending' },
  });
  const { selectedGameId } = useContext(DashboardContext);
  const t = useTranslations('Tournament.Round');

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
        <div className="px-4 pt-2">
          <SkeletonList length={8} height={16} />
        </div>
      </div>
    );
  }
  if (!players || players.length < 2)
    return (
      <p className="text-muted-foreground p-4 text-center text-sm text-balance">
        {t('add two players')}
      </p>
    );

  if (!data) return 'no data'; // FIXME Intl

  return (
    <div>
      <Overlay open={!!selectedGameId} />
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
