import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLongPress } from 'use-long-press';

const GameItemCompact: FC<GameProps> = ({
  id,
  result,
  playerLeft,
  playerRight,
}) => {
  const draw = result === '1/2-1/2';
  const leftWin = result === '1-0';
  const rightWin = result === '0-1';
  const [scaled, setScaled] = useState(false);
  const { overlayed, setOverlayed } = useContext(DashboardContext);
  const { tournamentId } = useContext(DashboardContext);
  const queryClient = useQueryClient();
  const ref = useRef<any>(null); // FIXME any
  const t = useTranslations('Results');
  const mutation = useTournamentSetGameResult(queryClient, {
    tournamentId,
  });

  const handleCardState = useCallback(
    (state: boolean) => {
      setOverlayed(state);
      setScaled(state);
    },
    [setOverlayed],
  );

  const bind = useLongPress(() => handleCardState(true), {
    cancelOnMovement: 1,
    cancelOutsideElement: true,
    threshold: 100,
    onCancel: () => {
      handleCardState(false);
    },
    filterEvents: () => {
      if (scaled || overlayed) return false;
      return true;
    },
  });

  const handleMutate = (newResult: ResultModel) => {
    if (overlayed && scaled && newResult !== result) {
      mutation.mutate({
        gameId: id,
        whiteId: playerLeft.white_id!,
        blackId: playerRight.black_id!,
        newResult,
        prevResult: result,
      });
    }
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      handleCardState(false);
    }
  }, [handleCardState, mutation.isSuccess]);

  useOutsideClick(() => {
    if (scaled) {
      handleCardState(false);
    }
  }, ref);

  if (window)
    window.oncontextmenu = function () {
      return false;
    }; // dev-line

  return (
    <Card
      className={`grid ${scaled && 'z-50 -translate-y-5 scale-105'} w-full grid-cols-[1fr_auto_1fr] items-center border p-2 text-sm transition-all duration-300 md:max-w-[250px]`}
      ref={ref}
      {...bind()}
    >
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words rounded-sm p-1 ${draw || rightWin ? 'opacity-40' : ''} justify-self-start`}
        onClick={() => handleMutate('1-0')}
      >
        <small className="line-clamp-2 text-left">
          {playerLeft.white_nickname}
        </small>
      </div>
      <div
        className={`mx-4 flex flex-grow gap-2 justify-self-center rounded-sm p-1`}
      >
        {mutation.isPending ? (
          <Loader2 className="size-8 animate-spin p-0" />
        ) : (
          <div onClick={() => handleMutate('1/2-1/2')}>
            {t(mutation.data || result || '?')}
          </div>
        )}
      </div>
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words rounded-sm p-1 ${draw || leftWin ? 'opacity-40' : ''} justify-self-end`}
        onClick={() => handleMutate('0-1')}
      >
        <small className="line-clamp-2 text-right">
          {playerRight.black_nickname}
        </small>
      </div>
    </Card>
  );
};

export type GameProps = {
  id: string;
  result: ResultModel | null;
  playerLeft: Record<'white_id' | 'white_nickname', string | null>;
  playerRight: Record<'black_id' | 'black_nickname', string | null>;
};

export default GameItemCompact;
