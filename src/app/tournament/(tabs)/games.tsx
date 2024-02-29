import {
  GameType,
  TournamentContext,
} from '@/app/tournament/[id]/tournament-context';
import GameContainer from '@/app/tournament/components/game-container';
import { SetStateAction } from 'jotai';
import { FC, useContext, useState } from 'react';

const Games: FC = () => {
  const [setResult] = useState<number | null>(null);
  const { games, currentRound } = useContext(TournamentContext);

  return (
    <>
      <h1>Round {currentRound} (current)</h1>
      {games[currentRound].map((game: GameType) => {
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

export default Games;
