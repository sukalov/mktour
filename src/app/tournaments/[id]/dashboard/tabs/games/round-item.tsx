import GameItemCompact from '@/app/tournaments/[id]/dashboard/tabs/games/game-item-compact';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import { GameModel, Result } from '@/types/tournaments';
import { usePathname } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useState } from 'react';

const RoundItem: FC<RoundItemProps> = ({ roundNumber }) => {
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { data: round, isError } = useTournamentRoundGames({
    tournamentId,
    roundNumber,
  });
  const [result, setResult] = useState<Result | null>(null);

  if (isError) return 'error';
  if (!round) return 'no round';

  return (
    <>
      {round.map((game, index) => (
        <GamesIteratee
          key={index}
          {...game}
          result={result}
          setResult={setResult}
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
}: GameModel & GamesIterateeProps) => (
  <GameItemCompact
    result={result}
    playerLeft={white_nickname}
    playerRight={black_nickname}
    setResult={setResult}
  />
);

type RoundItemProps = {
  roundNumber: number;
  compact?: boolean;
};

type GamesIterateeProps = {
  setResult: Dispatch<SetStateAction<Result | null>>;
};

export default RoundItem;
