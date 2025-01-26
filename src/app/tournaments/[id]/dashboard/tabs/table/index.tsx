'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { LoadingElement } from '@/app/tournaments/[id]/dashboard/tabs/main';
import { Medal, medalColour } from '@/app/tournaments/[id]/dashboard/tabs/main/winners';
import PlayerDrawer from '@/app/tournaments/[id]/dashboard/tabs/table/player-drawer';
import { useTournamentRemovePlayer } from '@/components/hooks/mutation-hooks/use-tournament-remove-player';
import { useTournamentInfo } from '@/components/hooks/query-hooks/use-tournament-info';
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
import { PlayerModel } from '@/types/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { UserRoundX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, PropsWithChildren, useContext, useState } from 'react';
import { toast } from 'sonner';

const TournamentTable: FC = ({}) => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const players = useTournamentPlayers(id);
  const tournament = useTournamentInfo(id);
  const { status, sendJsonMessage } = useContext(DashboardContext);
  const removePlayers = useTournamentRemovePlayer(
    id,
    queryClient,
    sendJsonMessage,
  );
  const { userId } = useContext(DashboardContext);
  const t = useTranslations('Tournament.Table');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerModel | null>(
    null,
  );
  const hasStarted = !!tournament.data?.tournament.started_at;
  const hasEnded = !!tournament.data?.tournament.closed_at;

  if (players.isLoading) return <TableLoading />;
  if (players.isError) {
    toast.error(t('added players error'), {
      id: 'query-added-players',
      duration: 3000,
    });
    return <TableLoading />;
  }

  const handleDelete = () => {
    if (userId && status === 'organizer' && !hasStarted) {
      removePlayers.mutate(
        {
          tournamentId: id,
          playerId: selectedPlayer!.id,
          userId,
        },
        { onSuccess: () => setSelectedPlayer(null) },
      );
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeadStyled className="text-center">#</TableHeadStyled>
            <TableHeadStyled>
              {t('name column', { number: players.data?.length ?? 0 })}
            </TableHeadStyled>
            <TableStatsHeads />
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.data?.map((player, i) => (
            <TableRow key={player.id} onClick={() => setSelectedPlayer(player)}>
              <TableCellStyled className={`font-small w-10 text-center`}>
                <Place player={player} hasEnded={hasEnded}>
                  {i + 1}
                </Place>
              </TableCellStyled>
              <TableCellStyled className="font-small flex gap-2 truncate pl-0">
                <Status player={{ ...player, exited: false }}>
                  {player.nickname}
                </Status>
              </TableCellStyled>
              <Stat>{player.wins}</Stat>
              <Stat>{player.draws}</Stat>
              <Stat>{player.losses}</Stat>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedPlayer && (
        <PlayerDrawer
          player={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          handleDelete={handleDelete}
          hasStarted={hasStarted}
          hasEnded={hasEnded}
        />
      )}
    </>
  );
};

const TableStatsHeads = () => {
  const { isMobile } = useContext(MediaQueryContext);
  const stats: Stats[] = ['wins', 'draws', 'losses'];
  const t = useTranslations(
    `Tournament.Table.Stats.${isMobile ? 'short' : 'full'}`,
  );

  return (
    <>
      {stats.map((stat) => (
        <TableHeadStyled key={stat} className="text-center">
          {t(stat)}
        </TableHeadStyled>
      ))}
    </>
  );
};

const TableLoading = () => {
  const t = useTranslations('Tournament.Table');
  return (
    <div className="mt-12 flex h-[calc(100svh-13rem)] w-full flex-auto items-center justify-center">
      <span className="sr-only">{t('loading')}</span>
      <LoadingElement />
    </div>
  );
};

const Place: FC<
  { player: PlayerModel; hasEnded: boolean } & PropsWithChildren
> = ({ player, hasEnded, children }) => {
  const place = player.place;

  if (!place || !hasEnded) return children;

  return place > 3 ? (
    place
  ) : (
    <Medal className={`${medalColour[place - 1]} size-4`} />
  );
};

const Status: FC<{ player: PlayerModel } & PropsWithChildren> = ({
  player,
  children,
}) => {
  if (!player.exited) return children;
  return (
    <div className="flex items-center gap-2 opacity-50">
      <UserRoundX className="size-4 min-w-fit" />
      {children}
    </div>
  );
};

const TableCellStyled: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => (
  <TableCell className={`p-3 text-wrap ${className}`}>{children}</TableCell>
);

const TableHeadStyled: FC<PropsWithChildren & { className?: string }> = ({
  children,
  className,
}) => <TableHead className={`h-11 p-0 ${className}`}>{children}</TableHead>;

const Stat: FC<PropsWithChildren> = ({ children }) => (
  <TableCellStyled className="min-w-8 text-center font-medium">
    {children}
  </TableCellStyled>
);

type Stats = 'wins' | 'draws' | 'losses';

export default TournamentTable;
