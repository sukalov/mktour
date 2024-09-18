'use client';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import GameItemCompact from '@/app/tournaments/[id]/dashboard/tabs/games/game-item-compact';
import Center from '@/components/center';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import Overlay from '@/components/overlay';
import SkeletonList from '@/components/skeleton-list';
import { GameModel } from '@/types/tournaments';
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

  const { overlayed } = useContext(DashboardContext);

  if (isLoading) return <SkeletonList />;
  if (isError) return <Center>error</Center>;
  if (!round) return <Center>no round</Center>;

  return (
    <div className={`flex flex-col gap-4`}>
      <Overlay open={overlayed} />
      {round.map((game, index) => (
        <GamesIteratee key={index} {...game} />
      ))}
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
