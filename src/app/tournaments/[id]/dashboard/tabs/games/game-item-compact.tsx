import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Result as ResultModel } from '@/types/tournaments';
import { Dispatch, FC, SetStateAction, useContext } from 'react';
import { useTranslations } from 'use-intl';

const GameItemCompact: FC<GameProps> = ({
  result,
  playerLeft,
  playerRight,
  setResult,
}) => {
  return (
    <Card
      className={`grid w-full grid-cols-[1fr_auto_1fr] items-center border px-4 py-2 text-sm md:max-w-[250px]`}
    >
      <div
        className={`max-w-full truncate ${result === '0-1' && 'opacity-30'} justify-self-start`}
      >
        {playerLeft}
      </div>
      <Result
        playerLeft={playerLeft}
        playerRight={playerRight}
        result={result}
        setResult={setResult}
      />
      <div
        className={`max-w-full truncate ${result === '1-0' && 'opacity-30'} justify-self-end`}
      >
        {playerRight}
      </div>
    </Card>
  );
};

const Result: FC<
  ResultProps & { playerLeft: string | null; playerRight: string | null }
> = ({ result }) => {
  const t = useTranslations('Results');
  const { setOverlayed } = useContext(DashboardContext);

  return (
    <Popover onOpenChange={setOverlayed}>
      <PopoverTrigger>
        <div className="mx-4 flex flex-grow gap-2 justify-self-center">
          {t(result || '?')}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90dvw] max-w-sm translate-y-[-.5rem] p-0"
        side="top"
        onInteractOutside={() => setOverlayed(false)}
      >
        <div className="grid w-full grid-cols-[1fr_auto_1fr]">
          <Button className="flex flex-col" variant="ghost">
            <h5>{t('1-0')}</h5>
          </Button>
          <Button className="grow" variant="ghost">
            {t('1-1')}
          </Button>
          <Button className="flex flex-col" variant="ghost">
            <h5>{t('0-1')}</h5>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type GameProps = {
  result: ResultModel | null;
  setResult: Dispatch<SetStateAction<ResultModel | null>>;
  playerLeft: string | null;
  playerRight: string | null;
};

type ResultProps = Pick<GameProps, 'result' | 'setResult'>;

export default GameItemCompact;
