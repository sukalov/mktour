import GameItem from '@/app/tournaments/[id]/dashboard/tabs/games/game-item';
import GameItemCompact from '@/app/tournaments/[id]/dashboard/tabs/games/game-item-compact';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import { GameModel, Result } from '@/types/tournaments';
import { usePathname } from 'next/navigation';
import { FC, SetStateAction, createElement, useState } from 'react';

const RoundItem: FC<RoundItemProps> = ({ roundNumber, compact = false }) => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { data: round, isError } = useTournamentRoundGames({
    tournamentId,
    roundNumber,
  });
  const [setResult] = useState<Result | null>(null);

  if (isError) return 'error';
  if (!round) return 'no round';

  return (
    <>
      {round.map((game, index) => (
        <GamesIteratee
          key={index}
          {...game}
          setResult={setResult}
          compact={compact}
        />
      ))}
    </>
  );
};

const GamesIteratee = ({
  result,
  white_nickname,
  black_nickname,
  setResult,
  compact,
}: GameModel & GamesIterateeProps) => {
  const component = createElement(compact ? GameItemCompact : GameItem, {
    result,
    player1: white_nickname || '',
    player2: black_nickname || '',
    setResult,
  });
  return <>{component}</>;
};

type RoundItemProps = {
  roundNumber: number;
  compact?: boolean;
};

type GamesIterateeProps = {
  setResult: SetStateAction<Result | null>;
  compact: boolean;
};

export default RoundItem;
