import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
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
  roundNumber,
}) => {
  const draw = result === '1/2-1/2';
  const [scaled, setScaled] = useState(false);
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { overlayed, setOverlayed, setEscapedItemId, sendJsonMessage } =
    useContext(DashboardContext);
  const queryClient = useQueryClient();
  const mutation = useTournamentSetGameResult(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const ref = useRef<any>(null); // FIXME any

  const handleCardState = useCallback(
    (state: boolean) => {
      setOverlayed(state);
      setScaled(state);
      setEscapedItemId(!state ? '' : id);
    },
    [id, setEscapedItemId, setOverlayed],
  );

  const bind = useLongPress(() => handleCardState(true), {
    cancelOnMovement: 1,
    cancelOutsideElement: true,
    threshold: 200,
    onCancel: () => {
      handleCardState(false);
    },
    filterEvents: () => {
      if (scaled || overlayed) return false;
      return true;
    },
  });

  const handleMutate = (newResult: ResultModel) => {
    if (overlayed && scaled && !mutation.isPending) {
      mutation.mutate({
        gameId: id,
        whiteId: playerLeft.white_id!,
        blackId: playerRight.black_id!,
        result: newResult,
        prevResult: result,
        tournamentId,
        roundNumber,
      });
    }
  };

  const resultProps: ResultProps = {
    isPending: mutation.isPending,
    result,
    scaled,
    handleMutate,
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      handleCardState(false);
    }
  }, [handleCardState, mutation.isSuccess]);

  useOutsideClick(
    () => {
      if (scaled) {
        handleCardState(false);
      }
    },
    ref,
    { capture: false, touch: 'touchstart' },
  );

  // if (window)
  //   window.oncontextmenu = function () {
  //     return false;
  //   }; // dev-line

  return (
    <Card
      className={`grid ${result && !scaled && 'opacity-50'} h-16 w-full grid-cols-3 items-center gap-2 border p-2 text-sm transition-all select-none hover:duration-300 md:max-w-72 ${scaled && 'z-50 -translate-y-2.5 scale-105'}`}
      ref={ref}
      {...bind()}
    >
      <PlayerButton
        isWinner={result === '1-0'}
        handleMutate={() => handleMutate('1-0')}
        scaled={scaled}
        nickname={playerLeft.white_nickname}
        position={{ justify: 'justify-self-start', text: 'text-left' }}
      />
      <Button
        variant="ghost"
        className={`${!scaled && 'pointer-events-none'} mx-4 flex h-full w-full min-w-16 grow gap-2 justify-self-center rounded-sm p-1 px-2 select-none ${scaled && draw && 'underline underline-offset-4'}`}
      >
        <Result {...resultProps} />
      </Button>
      <PlayerButton
        isWinner={result === '0-1'}
        handleMutate={() => handleMutate('0-1')}
        scaled={scaled}
        nickname={playerRight.black_nickname}
        position={{ justify: 'justify-self-end', text: 'text-right' }}
      />
    </Card>
  );
};

const PlayerButton: FC<PlayerButtonProps> = ({
  handleMutate,
  isWinner,
  nickname,
  scaled,
  muted,
  position,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        `${!scaled ? `pointer-events-none ${position.justify}` : 'justify-center'} line-clamp-2 h-full w-full max-w-full rounded-sm p-1 px-2 break-words text-ellipsis hyphens-auto select-none ${muted ? 'text-muted-foreground' : scaled && isWinner && 'underline underline-offset-4'}`,
      )}
      onClick={handleMutate}
    >
      <small
        className={`line-clamp-2 ${!scaled ? `pointer-events-none ${position.text}` : 'text-center'} `}
      >
        {nickname}
      </small>
    </Button>
  );
};

const Result: FC<ResultProps> = ({
  isPending,
  result,
  scaled,
  handleMutate,
}) => {
  const t = useTranslations('Tournament.Results');
  if (isPending) return <Loader2 className="size-5 animate-spin p-0" />;
  if (scaled)
    return (
      <div
        className={`select-none ${result && result !== '1/2-1/2' && 'text-muted-foreground'}`}
        onClick={() => handleMutate('1/2-1/2')}
      >
        <small className="select-none">{t('draw')}</small>
      </div>
    );
  if (!result) {
    return (
      <Card className="relative grid h-full w-24 min-w-16 grid-cols-2 select-none">
        <div className="flex w-full items-center justify-center"></div>
        <div className="border-l-muted flex w-full items-center justify-center border-l"></div>
      </Card>
    );
  }
  const parsedResult = result.split('-');
  const left = parsedResult?.at(0) === '1/2' ? '½' : parsedResult?.at(0);
  const right = parsedResult?.at(1) === '1/2' ? '½' : parsedResult?.at(1);
  return (
    <Card className="grid h-full w-24 min-w-16 grid-cols-2 select-none">
      <div className="flex w-full items-center justify-center opacity-60">
        {left ?? ''}
      </div>
      <div className="border-l-muted flex w-full items-center justify-center border-l opacity-60">
        {right ?? ''}
      </div>
    </Card>
  ); // FIXME styling
};

type PlayerButtonProps = {
  handleMutate: () => void;
  nickname: string | null;
  isWinner: boolean;
  scaled: boolean;
  muted?: boolean;
  position: {
    justify: 'justify-self-start' | 'justify-self-end';
    text: 'text-left' | 'text-right';
  };
};

type ResultProps = {
  isPending: boolean;
  result: ResultModel | null;
  scaled: boolean;
  handleMutate: (_result: ResultModel) => void;
};

type GameProps = {
  id: string;
  result: ResultModel | null;
  playerLeft: Record<'white_id' | 'white_nickname', string | null>;
  playerRight: Record<'black_id' | 'black_nickname', string | null>;
  roundNumber: number;
};

export default GameItemCompact;
