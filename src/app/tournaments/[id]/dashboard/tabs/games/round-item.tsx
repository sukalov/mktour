'use client';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import GameItemCompact from '@/app/tournaments/[id]/dashboard/tabs/games/game-item-compact';
import Center from '@/components/center';
import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import SkeletonList from '@/components/skeleton-list';
import { Button } from '@/components/ui/button';
import { generateRoundRobinRoundFunction } from '@/lib/client-actions/round-robin-generator';
import { GameModel, PlayerModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { FC, useContext } from 'react';

const RoundItem: FC<RoundItemProps> = ({ roundNumber }) => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const {
    data: round,
    isError,
    isLoading,
  } = useTournamentRoundGames({
    tournamentId,
    roundNumber,
  });
  const info = useTournamentInfo(tournamentId);
  const t = useTranslations('Tournament.Round');
  const queryClient = useQueryClient();
  const { escapedItemId, sendJsonMessage } = useContext(DashboardContext);
  const { mutate, isPending: mutating } = useSaveRound(
    tournamentId,
    queryClient,
    sendJsonMessage,
  );

  if (isLoading || !info.data)
    return (
      <div className="px-4">
        <SkeletonList length={8} height={16} />
      </div>
    );
  if (isError) return <Center>error</Center>;
  if (!round) return <Center>no round</Center>;
  const sortedRound = [...round].sort((a, b) => {
    return Number(a.result !== null) - Number(b.result !== null);
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
    const newGames = generateRoundRobinRoundFunction({
      players,
      games,
      roundNumber: roundNumber + 1,
      tournamentId,
    });
    mutate({ tournamentId, roundNumber: roundNumber + 1, newGames });
  };

  const ongoingGames = round.reduce(
    (acc, current) => (current.result === null ? acc + 1 : acc),
    0,
  );

  return (
    <>
      <div className="flex w-full flex-col gap-2 px-4 pt-2">
        <AnimatePresence>
          {roundNumber === info.data.tournament.ongoing_round &&
            ongoingGames === 0 && (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="pb-2"
              >
                <Button
                  className="w-full"
                  onClick={newRound}
                  disabled={mutating}
                >
                  {t('new round button')}
                </Button>
              </motion.div>
            )}
          {sortedRound.map((game, index) => {
            let escaped = game.id === escapedItemId;

            return (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`${escaped && 'z-50'}`}
              >
                <GamesIteratee key={index} {...game} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
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
  <GameItemCompact
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
