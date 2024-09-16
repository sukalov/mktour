'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FC, useContext, useState } from 'react';
import { useTranslations } from 'use-intl';

const GameItemCompact: FC<GameProps> = ({
  id,
  result,
  playerLeft,
  playerRight,
}) => {
  const draw = result === '1/2-1/2';
  const leftWin = result === '1-0';
  const rightWin = result === '0-1';

  return (
    <Card
      className={`grid w-full grid-cols-[1fr_auto_1fr] items-center border px-4 py-2 text-sm md:max-w-[250px]`}
    >
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words ${draw || rightWin ? 'opacity-40' : ''} justify-self-start`}
      >
        <small>{playerLeft}</small>
      </div>
      <Result
        id={id}
        playerLeft={playerLeft}
        playerRight={playerRight}
        result={result}
      />
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words ${draw || leftWin ? 'opacity-40' : ''} justify-self-end`}
      >
        <small>{playerRight}</small>
      </div>
    </Card>
  );
};

const Result: FC<ResultProps> = ({ id, result, playerLeft, playerRight }) => {
  const t = useTranslations('Results');
  const { tournamentId, setOverlayed } = useContext(DashboardContext);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useTournamentSetGameResult(queryClient, {
    tournamentId,
  });

  const handleOpen = (state: boolean) => {
    setOpen(state);
    setOverlayed(state);
  };

  const handleMutate = (result: ResultModel) => {
    mutate({ gameId: id, result }, { onSuccess: () => handleOpen(false) });
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger>
        <div className="mx-4 flex flex-grow gap-2 justify-self-center">
          {t(result || '?')}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90dvw] max-w-sm translate-y-[2.5rem] scale-105 p-1"
        side="top"
        onInteractOutside={() => handleOpen(false)}
      >
        <div className="flex w-full grid-cols-[1fr_auto_1fr] items-center justify-center">
          <div className="flex h-auto w-[40%] justify-start">
            <Button variant="ghost" onClick={() => handleMutate('1-0')}>
              <small
                className={`line-clamp-2 w-full hyphens-auto break-words text-left ${result === '1-0' && 'underline underline-offset-4'}`}
              >
                {playerLeft}
              </small>
            </Button>
          </div>
          <div
            className={`flex grow justify-center ${result === '1/2-1/2' && 'underline underline-offset-4'}`}
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Button variant="ghost" onClick={() => handleMutate('1/2-1/2')}>
                {t('1/2')}
              </Button>
              // boy oh boy i hate jsx
            )}
          </div>
          <div className="flex h-auto w-[40%] justify-end">
            <Button onClick={() => handleMutate('0-1')} variant="ghost">
              <small
                className={`line-clamp-2 w-full hyphens-auto break-words text-right ${result === '0-1' && 'underline underline-offset-4'}`}
              >
                {playerRight}
              </small>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

type GameProps = {
  id: string;
  result: ResultModel | null;
  playerLeft: string | null;
  playerRight: string | null;
};

type ResultProps = Pick<GameProps, 'result'> & {
  playerLeft: string | null;
  playerRight: string | null;
  id: string;
};

export default GameItemCompact;
