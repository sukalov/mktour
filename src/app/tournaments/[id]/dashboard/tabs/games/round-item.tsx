'use client';
import GameItemCompact from '@/app/tournaments/[id]/dashboard/tabs/games/game-item-compact';
import Center from '@/components/center';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import SkeletonList from '@/components/skeleton-list';
import { GameModel } from '@/types/tournaments';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

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

  if (isLoading)
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

  return (
    <div className="flex w-full flex-col gap-2 px-4">
        <AnimatePresence>
          {sortedRound.map((game, index) => (
            <motion.div
              key={game.id}
              layout
              initial={{ opacity: 0}}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GamesIteratee key={index} {...game} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
  );
};

const GamesIteratee = ({
  id,
  result,
  white_nickname,
  black_nickname,
  white_id,
  black_id,
}: GameModel) => (
  <GameItemCompact
    id={id}
    result={result}
    playerLeft={{ white_id, white_nickname }}
    playerRight={{ black_id, black_nickname }}
  />
);

type RoundItemProps = {
  roundNumber: number;
  compact?: boolean;
};

export default RoundItem;
