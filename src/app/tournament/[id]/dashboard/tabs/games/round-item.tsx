
import GameItem from '@/app/tournament/[id]/dashboard/tabs/games/game-item';
import GameItemCompact from '@/app/tournament/[id]/dashboard/tabs/games/game-item-compact';
import { GameModel, Result } from '@/types/tournaments';
import { FC, SetStateAction, createElement, useState } from 'react';

const RoundItem: FC<RoundItemProps> = ({ round, compact = false }) => {
  const [setResult] = useState<Result | null>(null);

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
    player1: white_nickname,
    player2: black_nickname,
    setResult,
  });
  return <>{component}</>;
};

type RoundItemProps = {
  round: GameModel[];
  compact?: boolean;
};

type GamesIterateeProps = {
  setResult: SetStateAction<Result | null>;
  compact: boolean;
};

export default RoundItem;
