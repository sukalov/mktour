import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { FC } from 'react';

const GameItemCompact: FC<GameProps> = ({ result, player1, player2 }) => {
  return (
    <Card className="grid w-full grid-cols-[1fr_auto_1fr] items-center border px-4 py-2 text-xs md:max-w-[250px]">
      <div
        className={`w-full truncate ${result === '0-1' && 'opacity-30'} justify-self-start`}
      >
        {player1}
      </div>
      <Result result={result} />
      <div
        className={`w-full truncate ${result === '1-0' && 'opacity-30'} justify-self-end`}
      >
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
    <div className="mx-4 flex flex-grow gap-2 justify-self-center">
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
