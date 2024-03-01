import { Player } from '@/app/tournament/[id]/tournament-context';
import { Card } from '@/components/ui/card';
import { SetStateAction } from 'jotai';
import { FC } from 'react';

const GameContainer: FC<GameProps> = ({ result, player1, player2 }) => {
  return (
    <Card className={`flex flex-row items-center justify-between border p-4 my-4`}>
      <div className="flex flex-col gap-4">
        <div>{player1.name}</div>
        <div>{player2.name}</div>
      </div>
      <Result result={result} />
    </Card>
  );
};

const Result = ({ result }: any) => {
  const resultP1 = result === 0 ? '1' : result === -1 ? '½' : '0';
  const resultP2 = result === 0 ? '0' : result === -1 ? '½' : '1';

  if (!result === null) return null;

  return (
    <div className={`flex w-[4rem] flex-col items-center justify-center gap-4`}>
      <div>{resultP1}</div>
      <div>{resultP2}</div>
    </div>
  );
};

interface GameProps {
  result: number | null;
  setResult: SetStateAction<any>;
  player1: Player;
  player2: Player;
}

export default GameContainer;
