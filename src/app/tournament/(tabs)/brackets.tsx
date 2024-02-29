import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import Game from '@/app/tournament/components/game-container';
import { useContext, useState } from 'react';

export default function Brackets() {
  const [result, setResult] = useState<number | null>(null);
  const { players } = useContext(TournamentContext);

  return (
    <Game
      result={result}
      player1={players[0]}
      player2={players[1]}
      setResult={setResult}
    />
  );
}
