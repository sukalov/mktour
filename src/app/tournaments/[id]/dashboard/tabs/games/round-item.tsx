'use client';
import { LoadingSpinner } from '@/app/loading';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import FinishTournamentButton from '@/app/tournaments/[id]/dashboard/finish-tournament-button';
import GameItem from '@/app/tournaments/[id]/dashboard/tabs/games/game/game-item';
import Center from '@/components/center';
import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import { useRoundData } from '@/components/hooks/use-round-data';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
import { generateRoundRobinRound } from '@/lib/client-actions/round-robin-generator';
import { GameModel, PlayerModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowRightIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, useContext } from 'react';

const RoundItem: FC<RoundItemProps> = ({ roundNumber }) => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const {
    data: round,
    isError,
    isLoading,
  } = useTournamentRoundGames({
    tournamentId,
    roundNumber,
  });
  const info = useTournamentInfo(tournamentId);
  const { data: players } = useTournamentPlayers(tournamentId);
  const { status } = useContext(DashboardContext);
  const { sortedRound, ongoingGames } = useRoundData(round, players);

  if (isLoading || !info.data || !players)
    return (
      <div className="px-4 pt-2">
        <SkeletonList length={8} height={16} />
      </div>
    );

  if (isError) return <Center>error</Center>;
  if (!round) return <Center>no round</Center>;

  const { ongoing_round, rounds_number, closed_at } = info.data.tournament;
  const renderFinishButton =
    status === 'organizer' && !closed_at && ongoing_round === rounds_number;
  const renderNewRoundButton =
    roundNumber === ongoing_round &&
    ongoing_round !== rounds_number &&
    ongoingGames === 0 &&
    status === 'organizer' &&
    round.length > 0;

  const ActionButton = () => {
    if (renderNewRoundButton)
      return (
        <NewRoundButton tournamentId={tournamentId} roundNumber={roundNumber} />
      );
    if (renderFinishButton)
      return <FinishTournamentButton lastRoundNumber={rounds_number} />;
    return null;
  };

  return (
    <div className="mk-list mk-container px-4 pt-2">
      <ActionButton />
      {sortedRound.map((game, index) => {
        return <GamesIteratee key={index} {...game} />;
      })}
    </div>
  );
};

const NewRoundButton: FC<{ tournamentId: string; roundNumber: number }> = ({
  tournamentId,
  roundNumber,
}) => {
  const t = useTranslations('Tournament.Round');
  const queryClient = useQueryClient();
  const { sendJsonMessage, setRoundInView } = useContext(DashboardContext);

  const { mutate, isPending: mutating } = useSaveRound({
    tournamentId,
    queryClient,
    sendJsonMessage,
    isTournamentGoing: true,
    setRoundInView,
  });

  const newRound = () => {
    const players = queryClient.getQueryData([
      tournamentId,
      'players',
      'added',
    ]) as PlayerModel[];
    const games = queryClient.getQueryData([
      tournamentId,
      'games',
    ]) as GameModel[];
    const newGames = generateRoundRobinRound({
      players,
      games,
      roundNumber: roundNumber + 1,
      tournamentId,
    });
    mutate({ tournamentId, roundNumber: roundNumber + 1, newGames });
  };

  return (
    <Button className="w-full" onClick={newRound} disabled={mutating}>
      {!mutating ? <ArrowRightIcon /> : <LoadingSpinner />}
      &nbsp;
      {t('new round button')}
    </Button>
  );
};

const GamesIteratee = ({
  id,
  result,
  white_nickname,
  black_nickname,
  white_id,
  black_id,
  round_number,
}: GameModel) => (
  <GameItem
    id={id}
    result={result}
    playerLeft={{ white_id, white_nickname }}
    playerRight={{ black_id, black_nickname }}
    roundNumber={round_number}
  />
);

type RoundItemProps = {
  roundNumber: number;
  compact?: boolean;
};

export default RoundItem;
