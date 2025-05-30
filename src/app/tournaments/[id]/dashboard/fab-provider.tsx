import { TabType } from '@/app/tournaments/[id]/dashboard';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import Fab from '@/app/tournaments/[id]/dashboard/fab';
import AddPlayerDrawer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player';
import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { useTournamentRoundGames } from '@/components/hooks/query-hooks/use-tournament-round-games';
import { generateRandomRoundGames } from '@/lib/client-actions/random-pairs-generator';
import { Status } from '@/server/queries/get-status-in-tournament';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Shuffle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FC, useContext } from 'react';

const FabProvider: FC<FabProviderProps> = ({
  status,
  currentTab,
  scrolling,
}) => {
  if (status !== 'organizer') return null;
  return (
    <div
      className={`${scrolling && 'opacity-50'} transition-all duration-300 ease-linear`}
    >
      {fabTabMap[currentTab]}
    </div>
  );
};

const ShuffleFab = () => {
  const { id: tournamentId } = useParams<{ id: string }>();
  const { data } = useTournamentInfo(tournamentId);
  const players = useTournamentPlayers(tournamentId);
  const games = useTournamentRoundGames({ tournamentId, roundNumber: 1 });
  const { userId } = useContext(DashboardContext);
  if (!userId) throw new Error('USERID_NOT_FOUND_IN_CONTEXT');
  const queryClient = useQueryClient();
  const { sendJsonMessage } = useContext(DashboardContext);
  const { isPending, mutate } = useSaveRound({
    queryClient,
    sendJsonMessage,
    isTournamentGoing: false,
  });

  if (data?.tournament.started_at || !games.data || !players.data) return null;

  if (players.data && players.data.length < 3) return <AddPlayerDrawer />;

  const handleClick = () => {
    const newGames = generateRandomRoundGames({
      players: players.data.map((player, i) => ({
        ...player,
        pairingNumber: i,
      })),
      games: games.data,
      roundNumber: 1,
      tournamentId,
    });
    mutate({ tournamentId, newGames, roundNumber: 1 });
  };

  return (
    <Fab
      disabled={isPending}
      icon={!isPending ? Shuffle : Loader2}
      onClick={handleClick}
    />
  );
};

const fabTabMap = {
  main: <AddPlayerDrawer />,
  table: <AddPlayerDrawer />,
  games: <ShuffleFab />,
};

type FabProviderProps = {
  status: Status;
  currentTab: TabType['title'];
  scrolling: boolean;
};

export default FabProvider;
