import { GameType } from '@/app/tournament/[id]/tournament-context';
import GameContainer from '@/app/tournament/components/game-container';
import { SetStateAction } from 'jotai';
import { FC, useState } from 'react';

const RoundItem: FC<{round: GameType[]}> = ({ round }) => {
  const [setResult] = useState<number | null>(null);
  return (
    <>
      {round.map((game: GameType) => {
        return (
          <GamesIteratee
            key={game.players[0].name + game.players[1].name}
            game={game}
            setResult={setResult}
          />
        );
      })}
    </>
  );
};

const GamesIteratee = ({
  game,
  setResult,
}: {
  game: GameType;
  setResult: SetStateAction<any>;
}) => {
  return (
    <GameContainer
      result={game.result}
      player1={game.players[0]}
      player2={game.players[1]}
      setResult={setResult}
    />
  );
};

export default RoundItem;
