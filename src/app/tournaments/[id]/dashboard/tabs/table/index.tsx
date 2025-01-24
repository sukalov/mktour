'use client';

import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
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
import { Loader2, UserRoundX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { FC, useContext, useState } from 'react';
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
            <TableHead className="pr-0 pl-4">#</TableHead>
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
              className={`backdrop-blur-2xl`}
              onClick={() => setSelectedPlayer(player)}
            >
              <TableCell className={`font-small pr-0 pl-4`}>{i + 1}</TableCell>
              <TableCell className="font-small max-w-[150px] truncate pl-0">
                <NicknameWithStatus player={player} hasEnded={hasEnded} />
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
        <TableHead key={stat} className="px-1 text-center">
          {t(stat)}
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

const NicknameWithStatus: FC<{ player: PlayerModel; hasEnded: boolean }> = ({
  player,
  hasEnded,
}) => {
  if (hasEnded && !player.exited)
    return (
      <div className="flex items-center gap-2 opacity-50">
        {player.nickname}
        <UserRoundX className="size-4" />
      </div>
    );
  if (!hasEnded || !player.place || player.place > 3) return player.nickname;

  const place = player.place;
  const medalColour = ['bg-amber-300', 'bg-amber-500', 'bg-amber-700'];
  const medal = (
    <div
      className={`aspect-square size-4 rounded-full ${medalColour[place - 1]}`}
    />
  );

  return (
    <div className="flex items-center gap-2">
      {player.nickname}
      {medal}
    </div>
  );
};

type Stats = 'wins' | 'draws' | 'losses';

export default TournamentTable;
