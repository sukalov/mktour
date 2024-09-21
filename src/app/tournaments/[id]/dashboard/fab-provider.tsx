import { TabType } from '@/app/tournaments/[id]/dashboard';
import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import Fab from '@/app/tournaments/[id]/dashboard/fab';
import AddPlayerDrawer from '@/app/tournaments/[id]/dashboard/tabs/table/add-player';
import useGenerateRoundRobinRound from '@/components/hooks/mutation-hooks/use-tournament-generate-rr-round';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Status } from '@/lib/db/hooks/get-status-in-tournament';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Shuffle } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
  const tournamentId = usePathname().split('/').at(-1) as string;
  const { data } = useTournamentInfo(tournamentId);
  const players = useTournamentPlayers(tournamentId);
  const { userId } = useContext(DashboardContext);
  const queryClient = useQueryClient();
  if (!userId) throw new Error('USERID_NOT_FOUND_IN_CONTEXT');
  const { isPending, mutate } = useGenerateRoundRobinRound(queryClient);

  if (data?.tournament.started_at || !players?.data?.length) return null;

  return (
    <Fab
      disabled={isPending}
      icon={!isPending ? Shuffle : Loader2}
      onClick={() => mutate({ tournamentId, userId, roundNumber: 1 })}
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
