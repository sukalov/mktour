import { GameProps } from '@/app/tournaments/[id]/dashboard/tabs/games/game-item-compact';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslations } from 'use-intl';

const Result: FC<
  GameProps & {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    deltaX: number | null;
  }
> = ({ result, playerLeft, playerRight, open, deltaX }) => {
  const t = useTranslations('Results');
  // const { tournamentId, setOverlayed } = useContext(DashboardContext);
  // const queryClient = useQueryClient();
  // const { mutate, isPending } = useTournamentSetGameResult(queryClient, {
  //   tournamentId,
  // });

  // const handleOpen = (state: boolean) => {
  //   setOpen(state);
  //   setOverlayed(state);
  // };

  return (
    <Popover
      open={open}
      // onOpenChange={handleOpen}
    >
      <PopoverTrigger>
        <div className="mx-4 flex flex-grow gap-2 justify-self-center">
          {t(result || '?')}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[90dvw] max-w-sm translate-y-[2.5rem] scale-105 p-1"
        side="top"
        // onInteractOutside={() => handleOpen(false)}
      >
        <div className="flex w-full grid-cols-[1fr_auto_1fr] items-center justify-center">
          <div className="flex h-auto w-[40%] justify-start">
            <Button
              // disabled={isPending}
              variant={deltaX && deltaX < -25 ? 'default' : 'ghost'}
              className="line-clamp-2 h-auto hyphens-auto break-words text-left"
              // onClick={() => handleMutate('1-0')}
            >
              <small
                className={`line-clamp-2 ${result === '1-0' && 'underline underline-offset-4'}`}
              >
                {playerLeft.white_nickname}
              </small>
            </Button>
          </div>
          <div
            className={`flex grow justify-center ${result === '1/2-1/2' && 'underline underline-offset-4'}`}
          >
            {/* {isPending ? (
              <Loader2 className="animate-spin" />
            ) : ( */}
              <Button
                variant={
                  !deltaX || (deltaX > -25 && deltaX < 25) ? 'default' : 'ghost'
                }
                // onClick={() => handleMutate('1/2-1/2')}
              >
                {t('1/2')}
              </Button>
              {/* // boy oh boy i hate jsx
            )} */}
          </div>
          <div className="flex h-auto w-[40%] justify-end">
            <Button
              // disabled={isPending}
              className="line-clamp-2 h-auto hyphens-auto break-words text-right"
              // onClick={() => handleMutate('0-1')}
              variant={deltaX && deltaX > 25 ? 'default' : 'ghost'}
            >
              <small
                className={`line-clamp-2 ${result === '0-1' && 'underline underline-offset-4'}`}
              >
                {playerRight.black_nickname}
              </small>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Result;
