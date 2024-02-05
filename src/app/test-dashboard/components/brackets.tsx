import { players } from '@/app/test-dashboard/components/mocks';
import { Card } from '@/components/ui/card';
import { SetStateAction, useEffect, useState } from 'react';
import { Joystick } from 'react-joystick-component';
import OutsideClickHandler from 'react-outside-click-handler';

export default function Brackets({
  handleResult,
  setActive,
}: SetStateAction<any>) {
  const [result, setResult] = useState<number | null>(null);
  const [pos, setPos] = useState<any>({});
  const [pressed, setPressed] = useState(false);
  const color = 'hsl(var(--muted-foreground))';

  // const bind = useLongPress(
  //   useCallback(() => {
  //     console.log('long-pressed');
  //     setPressed(true);
  //   }, []),
  //   { onStart: () => {setActive(false), setPressed(true)},
  //     onFinish: () => {setPressed(false), setActive(false)}
  //   },
  // );
  const onEdit = !pressed ? '' : 'border-green-900';
  const handleClick = (type: string) => {
    if (type === 'start') {
      setPressed(true);
      setActive(false);
    } else {
      setPressed(false);
      setActive(true);
    }
  };

  useEffect(() => {
    if (pos.direction === 'LEFT' && pos.distance === 100) {
      setResult(-1);
    }
    if (pos.direction === 'FORWARD' && pos.distance === 100) {
      setResult(0);
    }
    if (pos.direction === 'BACKWARD' && pos.distance === 100) {
      setResult(1);
    }
    if (pos.direction === 'RIGHT' && pos.distance === 100) {
      setResult(null);
    }
  }, [pos.direction, pos.distance]);

  return (
    <Card
      className={`flex flex-row items-center border ${onEdit} justify-between p-4`}
    >
      <Pair
        result={result}
        setResult={setResult}
        handleResult={handleResult}
        player1={players[0]}
        player2={players[1]}
      />
      <OutsideClickHandler onOutsideClick={() => setActive(true)}>
        {/* <div {...bind()}> */}
        <Joystick
          // disabled={!pressed}
          start={() => handleClick('start')}
          stop={() => handleClick('')}
          size={50}
          baseColor=""
          stickColor={color}
          throttle={100}
          move={(pos) => setPos(pos)}
        />
        {/* </div> */}
      </OutsideClickHandler>
    </Card>
  );
}

const Pair: React.FC<PairProps> = ({
  result,
  setResult,
  handleResult,
  player1,
  player2,
}) => {
  const [submit, setSubmit] = useState(false);

  return (
    <div className="flex flex-row justify-between gap-4">
      <div className="flex flex-col gap-6">
        <div>{player1.name}</div>
        <div>{player2.name}</div>
      </div>
      <Result setSubmit={setSubmit} result={result} />
    </div>
  );
};

const Result = ({ handleClick, setSubmit, result }: any) => {
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
  handleResult: (index: number, result: 'win' | 'loose' | 'draw') => void;
  player1: { name: string };
  player2: { name: string };
}
