import { players } from '@/app/test-dashboard/components/mocks';
import { Card } from '@/components/ui/card';
import { SetStateAction, useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';

export default function Brackets({ handleResult }: SetStateAction<any>) {
  return (
    <div className="flex flex-col gap-2">
      <Pair
        handleResult={handleResult}
        player1={players[0]}
        player2={players[1]}
      />
    </div>
  );
}

interface PairProps {
  handleResult: (index: number, result: 'win' | 'loose' | 'draw') => void;
  player1: { name: string };
  player2: { name: string };
}

const Pair: React.FC<PairProps> = ({ handleResult, player1, player2 }) => {
  const [submit, setSubmit] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const handleClick = (winnerIndex: number) => {
    setSubmit(false);
    if (winnerIndex < 0) {
      setResult(-1);
      handleResult(0, 'draw');
      handleResult(1, 'draw');
      return;
    }
    const loserIndex = 1 - winnerIndex;
    setResult(winnerIndex);
    handleResult(winnerIndex, 'win');
    handleResult(loserIndex, 'loose');
  };

  return (
    <OutsideClickHandler onOutsideClick={() => setResult(null)}>
      <Card>
        <div className="flex flex-row justify-between p-2">
          <div className="flex flex-col gap-6 p-4">
            <div>{player1.name}</div>
            <div>{player2.name}</div>
          </div>
          {!submit ? (
            <Controls setSubmit={setSubmit} result={result} />
          ) : (
            <SubmitForm handleClick={handleClick} setSubmit={setSubmit} />
          )}
        </div>
      </Card>
    </OutsideClickHandler>
  );
};

const SubmitForm = ({ handleClick, setSubmit }: any) => {
  return (
    <OutsideClickHandler onOutsideClick={() => setSubmit(false)}>
      <div
        className="h-[33.3%] w-[4rem] flex-1 rounded-t-md bg-white"
        onClick={() => handleClick(0)}
      ></div>
      <div
        className="h-[33.3%] w-[4rem] flex-1 bg-gray-500"
        onClick={() => handleClick(-1)}
      ></div>
      <div
        className="h-[33.3%] w-[4rem] flex-1 bg-black"
        onClick={() => handleClick(1)}
      ></div>
    </OutsideClickHandler>
  );
};

const Controls = ({ handleClick, setSubmit, result }: any) => {
  console.log(result);
  const resultColor = result === 0 ? 'white' : result === -1 ? 'gray' : 'black';
  const resultText = result === 0 ? '1-0' : result === -1 ? '½ ½' : '0-1';

  if (result === null)
    return (
      <Card
        className="flex w-[4rem] items-center justify-center border-white p-1"
        onClick={() => setSubmit(true)}
      >
        ?
      </Card>
    );

  return (
    <div
      style={{ backgroundColor: resultColor, border: '1px solid white' }}
      className="flex flex-col justify-center items-center w-[4rem] border-t-white rounded-md text-cyan-400"
    >
      {resultText}
    </div>
  );
};
