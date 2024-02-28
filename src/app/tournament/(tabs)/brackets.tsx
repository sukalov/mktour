import { TournamentContext } from '@/app/tournament/[id]/tournament-context';
import { Card } from '@/components/ui/card';
import { SetStateAction, useContext, useState } from 'react';

export default function Brackets() {
  const [result, setResult] = useState<number | null>(null);
  const { players } = useContext(TournamentContext);

  return (
    <Card
      id="resultCard"
      className={`flex flex-row items-center justify-between border p-4`}
    >
      <Pair
        result={result}
        setResult={setResult}
        player1={players[0]}
        player2={players[1]}
      />
      <Pair
        result={result}
        setResult={setResult}
        player1={players[2]}
        player2={players[3]}
      />
    </Card>
  );
}

const Pair: React.FC<PairProps> = ({ result, player1, player2 }) => {
  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex flex-col gap-6">
        <div>{player1.name}</div>
        <div>{player2.name}</div>
      </div>

      <Result result={result} />
    </div>
  );
};

const Result = ({ result }: any) => {
  const resultP1 = result === 0 ? '1' : result === -1 ? '½' : '0';
  const resultP2 = result === 0 ? '0' : result === -1 ? '½' : '1';

  if (result === null) return null;

  return (
    <div className={`flex w-[4rem] flex-col items-center justify-center gap-6`}>
      <div>{resultP1}</div>
      <div>{resultP2}</div>
    </div>
  );
};

interface PairProps {
  result: number | null;
  setResult: SetStateAction<any>;
  player1: { name: string };
  player2: { name: string };
}
