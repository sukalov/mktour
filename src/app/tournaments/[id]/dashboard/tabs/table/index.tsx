'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { useTournamentRemovePlayer } from '@/components/hooks/mutation-hooks/use-tournament-remove-player';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { MediaQueryContext } from '@/components/providers/media-query-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';
import { FC, useContext } from 'react';
import { toast } from 'sonner';

const TournamentTable: FC = ({}) => {
  const id = usePathname().split('/').at(-1) as string;
  const queryClient = useQueryClient();
  const players = useTournamentPlayers(id);
  const { status, sendJsonMessage } = useContext(DashboardContext);
  const removePlayers = useTournamentRemovePlayer(
    id,
    queryClient,
    sendJsonMessage,
  );
  const { userId } = useContext(DashboardContext);
  const t = useTranslations('Tournament.Table');

  if (players.isLoading) return <TableLoading />;
  if (players.isError) {
    toast.error(t('added players error'), {
      id: 'query-added-players',
      duration: 3000,
    });
    return <TableLoading />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4 pr-0">#</TableHead>
          <TableHead className="pl-0">
            {t('name column', { number: players.data?.length ?? 0 })}
          </TableHead>
          <TableStatsHeads />
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.data?.map((player, i) => (
          <TableRow
            key={player.id}
            onClick={() => {
              if (userId && status === 'organizer') {
                removePlayers.mutate({
                  tournamentId: id,
                  playerId: player.id,
                  userId,
                })
              };
            }}
          >
            <TableCell className="font-small pl-4 pr-0">{i + 1}</TableCell>
            <TableCell className="font-small max-w-[150px] truncate pl-0">
              {player.nickname}
            </TableCell>
            <TableCell className="px-1 text-center font-medium">
              {player.wins}
            </TableCell>
            <TableCell className="px-1 text-center font-medium">
              {player.draws}
            </TableCell>
            <TableCell className="px-1 pr-2 text-center font-medium">
              {player.losses}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TableStatsHeads = () => {
  const { isMobile } = useContext(MediaQueryContext);
  const DEFAULT_DASHBOARD_TABS: Stats[] = ['wins', 'draws', 'losses'];
  const DEFAULT_DASHBOARD_TABS_SHORT: StatsShort[] = ['w', 'd', 'l'];
  const titles = isMobile
    ? DEFAULT_DASHBOARD_TABS_SHORT
    : DEFAULT_DASHBOARD_TABS;
  const t = useTranslations('Tournament.Table');

  return (
    <>
      {titles.map((title) => (
        <TableHead key={title} className="px-1 text-center">
          {t(title)}
        </TableHead>
      ))}
    </>
  );
};

const TableLoading = () => {
  const t = useTranslations('Tournament.Table');
  return (
    <div className="mt-12 flex h-[calc(100svh-13rem)] w-full flex-auto items-center justify-center">
      <span className="sr-only">{t('loading')}</span>
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
};

type Stats = 'wins' | 'draws' | 'losses';
type StatsShort = 'w' | 'd' | 'l';

export default TournamentTable;
