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
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words ${result === '0-1' && 'opacity-30'} justify-self-start`}
      >
        <small>{playerLeft}</small>
      </div>
      <Result
        playerLeft={playerLeft}
        playerRight={playerRight}
        result={result}
        setResult={setResult}
      />
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words ${result === '1-0' && 'opacity-30'} justify-self-end`}
      >
        <small>{playerRight}</small>
      </div>
    </Card>
  );
};

const Result: FC<
  ResultProps & { playerLeft: string | null; playerRight: string | null }
> = ({ result, playerLeft, playerRight }) => {
  const t = useTranslations('Results');
  const { setOverlayed } = useContext(DashboardContext);

  return (
    <Popover onOpenChange={setOverlayed}>
      <PopoverTrigger>
        <div className="mx-4 flex flex-grow gap-2 justify-self-center">
          <small>{t(result || '?')}</small>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90dvw] max-w-sm translate-y-[3rem] scale-105 p-1"
        side="top"
        onInteractOutside={() => setOverlayed(false)}
      >
        <div className="flex w-full grid-cols-[1fr_auto_1fr] items-center justify-center">
          <Button className="flex h-auto w-[40%]" variant="ghost">
            <small className="line-clamp-2 w-full hyphens-auto break-words text-left">
              {playerLeft}
            </small>
          </Button>
          <div className="flex grow justify-center">
            <Button variant="ghost">{t('draw')}</Button>
          </div>
          <Button className="flex h-auto w-[40%]" variant="ghost">
            <small className="line-clamp-2 w-full hyphens-auto break-words text-right">
              {playerRight}
            </small>
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
