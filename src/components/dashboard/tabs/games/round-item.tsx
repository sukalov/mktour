import GameItem from '@/components/dashboard/tabs/games/game-item';
import { FC, useState } from 'react';

const RoundItem: FC<RoundItemProps> = ({ round }) => {
  const [setResult] = useState<number | null>(null);

  return (
    <>
      {round.map((game: any) => (
        <GamesIteratee
          key={game.id} // Assuming 'id' is unique for each game
          game={game}
          setResult={setResult}
        />
      ))}
    </>
  );
};

const GamesIteratee = ({ game, setResult }: { game: any; setResult: any }) => {
  return (
    <GameItem
      result={game.result}
      player1={game.white_nickname}
      player2={game.black_nickname}
      setResult={setResult}
    />
  );
};

type RoundItemProps = {
  round: any;
};

export default RoundItem;
