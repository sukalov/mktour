'use client';

import { DashboardContext } from '@/components/dashboard/dashboard-context';
import { onClickRemovePlayer } from '@/components/dashboard/helpers/on-click-handlers';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const { sendJsonMessage } = useContext(DashboardContext);
  const [selectedPlayerId, setPlayerId] = useState('');
  const bind = useLongPress(() => {
    if (window && window.confirm('Delete player?')) {
      onClickRemovePlayer(selectedPlayerId, sendJsonMessage);
    }
  });

  return (
    <div>
      <div className="px-4">
        <ScrollArea className='fixed' color='white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-2">#</TableHead>
                <TableHead className="pl-0">Name</TableHead>
                <TableResultHeads />
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
                  <TableCell className="font-small p-2">{i + 1}</TableCell>
                  <TableCell className="font-small max-w-[150px] truncate pl-0">
                    {player.nickname}
                  </TableCell>
                  <TableResultCell stat={player.wins} />
                  <TableResultCell stat={player.draws} />
                  <TableResultCell stat={player.losses} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

const TableResultHeads = () => {
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
        <TableHead key={title} className="p-1">
          {title}
        </TableHead>
      ))}
    </>
  );
};

const TableResultCell: FC<{ stat: number | null }> = ({ stat }) => (
  <TableCell className="p-1 font-medium">{stat}</TableCell>
);

export default TournamentTable;
