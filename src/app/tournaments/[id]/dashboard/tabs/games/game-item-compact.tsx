import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import Result from '@/app/tournaments/[id]/dashboard/tabs/games/result';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { delay } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FC, useContext, useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
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

  if (window)
    window.oncontextmenu = function () {
      return false;
    }; // dev-line

  const [open, setOpen] = useState(false);
  const [scaled, setScaled] = useState(false);
  const { setOverlayed } = useContext(DashboardContext);
  const [deltaX, setDeltaX] = useState<number | null>(null);
  const [deltaY, setDeltaY] = useState<number | null>(null);

  const onLongPress = () => {
    setOverlayed(true);
    setOpen(true);
    setScaled(false);
  };

  const bind = useLongPress(() => onLongPress(), {
    cancelOnMovement: 2,
    cancelOutsideElement: true,
    threshold: 125,
    onStart: () => {
      delay(() => setScaled(true), 25);
    },
    onCancel: () => {
      setScaled(false);
    },
  });

  useEffect(() => {
    if (deltaY) {
      if (deltaY > 50 || deltaY < -50) {
        setOverlayed(false);
        setOpen(false);
        setDeltaX(null);
      }
    }
  }, [deltaY, setOverlayed]);

  const getResult = (deltaX: number | null): ResultModel => {
    if (deltaX) {
      if (deltaX > 25) return '0-1';
      if (deltaX < -25) return '1-0';
    }
    return '1/2-1/2';
  };

  const swipeHandlers = useSwipeable({
    onSwiping: ({ deltaX, deltaY }) => {
      setDeltaX(deltaX);
      setDeltaY(deltaY);
    },
    onTouchEndOrOnMouseUp: () => {
      if (open) {
        setOverlayed(false);
        setOpen(false);
        setDeltaX(null);
        handleMutate(getResult(deltaX));
      }
    },
    trackMouse: true,
    preventScrollOnSwipe: true,
  });
  const { tournamentId } = useContext(DashboardContext);
  const queryClient = useQueryClient();
  const mutation = useTournamentSetGameResult(queryClient, {
    tournamentId,
  });

  const handleMutate = (newResult: ResultModel) => {
    if (newResult !== result) {
      mutation.mutate({
        gameId: id,
        whiteId: playerLeft.white_id!,
        blackId: playerRight.black_id!,
        newResult,
        prevResult: result,
      });
    }
  };

  return (
    <Card
      className={`grid ${scaled && 'scale-110'} w-full grid-cols-[1fr_auto_1fr] items-center border px-4 py-2 text-sm transition-all md:max-w-[250px]`}
      {...bind()}
      {...swipeHandlers}
    >
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words ${draw || rightWin ? 'opacity-40' : ''} justify-self-start`}
      >
        <small>{playerLeft.white_nickname}</small>
      </div>
      {mutation.isPending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Result
          id={id}
          playerLeft={playerLeft}
          playerRight={playerRight}
          result={result}
          open={open}
          setOpen={setOpen}
          deltaX={deltaX}
        />
      )}
      <div
        className={`line-clamp-2 max-w-full text-ellipsis hyphens-auto break-words ${draw || leftWin ? 'opacity-40' : ''} justify-self-end`}
      >
        <small>{playerRight.black_nickname}</small>
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
