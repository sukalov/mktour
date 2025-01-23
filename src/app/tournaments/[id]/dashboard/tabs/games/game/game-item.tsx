import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import Player from '@/app/tournaments/[id]/dashboard/tabs/games/game/player';
import Result, {
  ResultProps,
} from '@/app/tournaments/[id]/dashboard/tabs/games/game/result';
import StartTournamentButton from '@/app/tournaments/[id]/dashboard/tabs/main/start-tournament-button';
import FormattedMessage from '@/components/formatted-message';
import useTournamentSetGameResult from '@/components/hooks/mutation-hooks/use-tournament-set-game-result';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import useOutsideClick from '@/components/hooks/use-outside-click';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Result as ResultModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const GameItem: FC<GameProps> = ({
  id,
  result,
  playerLeft,
  playerRight,
  roundNumber,
}) => {
  const draw = result === '1/2-1/2';
  const { id: tournamentId } = useParams<{ id: string }>();
  const { selectedGameId, setSelectedGameId, sendJsonMessage, status } =
    useContext(DashboardContext);
  const queryClient = useQueryClient();
  const mutation = useTournamentSetGameResult(queryClient, {
    tournamentId,
    sendJsonMessage,
  });
  const { data } = useTournamentInfo(tournamentId);
  const ref = useRef<HTMLDivElement>(null);
  const selected = selectedGameId === id;
  const muted = result && !selected;
  const [open, setOpen] = useState(false);
  const hasStarted = !!data?.tournament.started_at;

  const handleCardState = useCallback(
    (state: boolean) => {
      if (!hasStarted) setOpen(true);
      else setSelectedGameId(state ? id : null);
    },
    [id, setSelectedGameId, hasStarted],
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
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      handleCardState(false);
    }
  }, [handleCardState, mutation.isSuccess]);

  useEffect(() => setOpen(false), [hasStarted]);

  useOutsideClick(() => {
    if (selected) {
      handleCardState(false);
    }
  }, ref);

  const disabled = status !== 'organizer' || !!data?.tournament.closed_at;

  return (
    <>
      <motion.div
        key={id}
        ref={ref}
        className={`${disabled && 'pointer-events-none'} cursor-pointer rounded-lg shadow-lg md:w-fit ${
          selected ? 'z-50' : 'z-0'
        }`}
        initial={{ scale: 1, y: 0 }}
        animate={selected ? { scale: 1.05, y: -10 } : { scale: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        onClick={() => handleCardState(true)}
      >
        <Card
          className={`grid ${muted && 'opacity-50'} h-16 w-full grid-cols-3 items-center gap-2 border p-2 text-sm transition-all select-none ${!selected && 'pointer-events-none'} md:max-w-72`}
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
            onClick={() => handleMutate('1/2-1/2')}
            className={`mx-4 flex h-full w-full min-w-16 grow gap-2 justify-self-center rounded-sm p-1 px-2 select-none ${selected && draw && 'underline underline-offset-4'}`}
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
      <StartTournamentDrawer open={open} setOpen={setOpen} />
    </>
  );
};

const StartTournamentDrawer: FC<{
  open: boolean;
  setOpen: (arg: boolean) => void;
}> = ({ open, setOpen }) => {
  return (
    <Drawer open={open} onClose={() => setOpen(false)}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <FormattedMessage id="Tournament.Round.start tournament.title" />
          </DrawerTitle>
          <DrawerDescription>
            <FormattedMessage id="Tournament.Round.start tournament.description" />
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex w-full flex-col gap-4 p-4 pt-0">
          <StartTournamentButton />
          <DrawerClose asChild>
            <Button size="lg" variant="outline">
              <FormattedMessage id="Common.cancel" />
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
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
