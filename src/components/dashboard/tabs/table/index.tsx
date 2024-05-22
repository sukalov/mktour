'use client';

import { DashboardContext } from '@/components/dashboard/dashboard-context';
import { onClickRemovePlayer } from '@/components/dashboard/helpers/on-click-handlers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { FC, useContext, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLongPress } from 'use-long-press';

const TournamentTable: FC = () => {
  const { players } = useTournamentStore();
  const { status, sendJsonMessage } = useContext(DashboardContext);
  const [selectedPlayerId, setPlayerId] = useState('');
  const bind = useLongPress(
    () => {
      if (status === 'organizer' && window.confirm('Delete player?')) {
        onClickRemovePlayer(selectedPlayerId, sendJsonMessage);
      }
    },
    { cancelOnMovement: true },
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="pl-4 pr-0">#</TableHead>
          <TableHead className="pl-0">
            name ({players.length} players)
          </TableHead>
          <TableStatsHeads />
        </TableRow>
      </TableHeader>
      <TableBody>
        {players?.map((player, i) => (
          <TableRow
            key={player.id}
            {...bind()}
            onTouchStart={() => setPlayerId(player.id)}
            onMouseDown={() => setPlayerId(player.id)}
          >
            <TableCell className="font-small pl-4 pr-0">{i + 1}</TableCell>
            <TableCell className="font-small max-w-[150px] truncate pl-0">
              {player.nickname}
            </TableCell>
            <TableCell className="px-1 font-medium">{player.wins}</TableCell>
            <TableCell className="px-1 font-medium">{player.draws}</TableCell>
            <TableCell className="px-1 pr-2 font-medium">
              {player.losses}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TableStatsHeads = () => {
  const isMobile = useMediaQuery({ maxWidth: 500 });
  const defaultTitles = ['wins', 'draws', 'losses'];
  const [titles, setTitles] = useState(defaultTitles);

  useEffect(() => {
    isMobile
      ? setTitles(titles.map((title) => title.slice(0, 1)))
      : setTitles(defaultTitles);
  }, [isMobile]);

  return (
    <>
      {titles.map((title) => (
        <TableHead key={title} className="px-1">
          {title}
        </TableHead>
      ))}
    </>
  );
};

export default TournamentTable;
