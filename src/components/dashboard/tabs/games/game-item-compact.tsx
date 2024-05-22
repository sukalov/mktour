import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { FC } from 'react';

const GameItemCompact: FC<GameProps> = ({ result, player1, player2 }) => {
  return (
    <Card
      className={`flex w-full justify-between border p-2 px-4 text-xs md:max-w-[250px]`}
    >
      <div className={`truncate ${result === '0-1' && 'opacity-30'}`}>
        {player1}
      </div>
      <Result result={result} />
      <div className={`truncate ${result === '1-0' && 'opacity-30'}`}>
        {player2}
      </div>
    </Card>
  );
};

const Result = ({ result }: { result: ResultModel | null }) => {
  // FIXME Intl
  const resultP1 = result === '1-0' ? '1' : result === '1/2-1/2' ? '½' : '0';
  const resultP2 = result === '1-0' ? '0' : result === '1/2-1/2' ? '½' : '1';

  if (!result) return null;

  return (
    <div className="flex flex-grow justify-center gap-2">
      <div className={`${result === '0-1' && 'opacity-30'}`}>{resultP1}</div>
      <div>:</div>
      <div className={`${result === '1-0' && 'opacity-30'}`}>{resultP2}</div>
    </div>
  );
};

interface GameProps {
  result: ResultModel | null;
  setResult: any;
  player1: string;
  player2: string;
}

export default GameItemCompact;
