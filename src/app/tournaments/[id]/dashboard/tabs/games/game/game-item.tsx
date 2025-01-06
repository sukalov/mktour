import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import Player from '@/app/tournaments/[id]/dashboard/tabs/games/game/player';
import Result, {
  ResultProps,
} from '@/app/tournaments/[id]/dashboard/tabs/games/game/result';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { FC, useCallback, useContext, useEffect, useRef } from 'react';

const GameItem: FC<GameProps> = ({
  id,
  result,
  playerLeft,
  playerRight,
  roundNumber,
}) => {
  const draw = result === '1/2-1/2';
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { selectedGameId, setSelectedGameId, sendJsonMessage, status } =
    useContext(DashboardContext);
  const queryClient = useQueryClient();
  const mutation = useTournamentSetGameResult(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const ref = useRef<any>(null); // FIXME any
  const selected = selectedGameId === id;

  const handleCardState = useCallback(
    (state: boolean) => {
      setSelectedGameId(state ? id : null);
    },
    [id, setSelectedGameId],
  );

  const handleMutate = (newResult: ResultModel) => {
    if (selected && !mutation.isPending) {
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
    selected,
    handleMutate,
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      handleCardState(false);
    }
  }, [handleCardState, mutation.isSuccess]);

  useOutsideClick(() => {
    if (selected) {
      handleCardState(false);
    }
  }, ref);

  return (
    <motion.div
      key={id}
      className={`cursor-pointer rounded-lg shadow-lg ${
        selected ? 'pointer-events-auto z-50' : 'z-0'
      }`}
      initial={{ scale: 1, y: 0 }}
      animate={selected ? { scale: 1.05, y: -10 } : { scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={() => handleCardState(true)}
    >
      <Card
        className={`grid ${result && !selected && 'opacity-50'} h-16 w-full grid-cols-3 items-center gap-2 border p-2 text-sm transition-all select-none hover:duration-300 md:max-w-72`}
        ref={ref}
      >
        <Player
          isWinner={result === '1-0'}
          handleMutate={() => handleMutate('1-0')}
          selected={selected}
          nickname={playerLeft.white_nickname}
          position={{ justify: 'justify-self-start', text: 'text-left' }}
        />
        <Button
          variant="ghost"
          className={`${!selected && 'pointer-events-none'} mx-4 flex h-full w-full min-w-16 grow gap-2 justify-self-center rounded-sm p-1 px-2 select-none ${selected && draw && 'underline underline-offset-4'}`}
        >
          <Result {...resultProps} />
        </Button>
        <Player
          isWinner={result === '0-1'}
          handleMutate={() => handleMutate('0-1')}
          selected={selected}
          nickname={playerRight.black_nickname}
          position={{ justify: 'justify-self-end', text: 'text-right' }}
        />
      </Card>
    </motion.div>
  );
};

type GameProps = {
  id: string;
  result: ResultModel | null;
  playerLeft: Record<'white_id' | 'white_nickname', string | null>;
  playerRight: Record<'black_id' | 'black_nickname', string | null>;
  roundNumber: number;
};

export default GameItem;
