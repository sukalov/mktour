import {
  DashboardContextType,
  Round,
} from '@/app/tournament/[id]/dashboard-context';
import GameItem from '@/app/tournament/components/game-item';
import { FC, useState } from 'react';

const RoundItem: FC<RoundItemProps> = ({ round }) => {
  const [setResult] = useState<number | null>(null);
  return (
    <>
      {round.map((game: DashboardContextType['games'][0][0]) => (
        <GamesIteratee
          key={game.id} // Assuming 'id' is unique for each game
          game={game}
          setResult={setResult}
        />
      ))}
    </>
  );
};

type RoundItemProps = {
  round: Round;
};

const GamesIteratee = ({
  game,
  setResult,
}: {
  game: DashboardContextType['games'][0][0];
  setResult: any;
}) => {
  return (
    <GameItem
      result={game.result}
      player1={game.white_nickname}
      player2={game.black_nickname}
      setResult={setResult}
    />
  );
};

export default RoundItem;
