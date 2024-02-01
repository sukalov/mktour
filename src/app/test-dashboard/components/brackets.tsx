import { players } from '@/app/test-dashboard/components/mocks';
import { Card } from '@/components/ui/card';
import { SetStateAction, useState } from 'react';

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

  const handleClick = (winnerIndex: number) => {
    setSubmit(false);
    if (winnerIndex < 0) {
      handleResult(0, 'draw');
      handleResult(1, 'draw');
      return;
    }
    const loserIndex = 1 - winnerIndex;
    handleResult(winnerIndex, 'win');
    handleResult(loserIndex, 'loose');
  };

  return (
    <Card>
      <div className="flex justify-between p-8" onClick={() => setSubmit(false)}>
        <div className="flex flex-col gap-6">
          <div>{player1.name}</div>
          <div>{player2.name}</div>
        </div>
        {!submit ? (
          <Controls setSubmit={setSubmit} />
        ) : (
          <SubmitForm handleClick={handleClick} />
        )}
      </div>
    </Card>
  );
};

const SubmitForm = ({ handleClick }: any) => {
  return (
    <div className="">
      <div onClick={() => handleClick(0)}>Win 1</div>
      <div onClick={() => handleClick(-1)}>Draw____</div>
      <div onClick={() => handleClick(1)}>Win 2</div>
    </div>
  );
};

const Controls = ({ handleClick, setSubmit }: any) => {
  return (
    <Card className="border-white p-1">
      {[0, 1].map((index) => (
        <div
          key={index}
          className={`h-[50%] w-6 ${index === 0 ? 'bg-white' : 'bg-black'}`}
          onClick={() => setSubmit(true)}
        ></div>
      ))}
    </Card>
  );
};
