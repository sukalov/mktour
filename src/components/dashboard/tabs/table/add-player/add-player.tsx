// import { Input } from '@/components/dashboard/tabs/table/add-player';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  DatabasePlayerSlice,
  useTournamentStore,
} from '@/lib/hooks/use-tournament-store';
import { FC, useState } from 'react';

const AddPlayer: FC<any> = ({ handleAddPlayer }) => {
  const [value, setValue] = useState('');
  const { possiblePlayers, players } = useTournamentStore();
  const filteredPlayers = possiblePlayers.filter(
    (player: DatabasePlayerSlice) => {
      const regex = new RegExp(value, 'i');
      if (value === '') return player;
      return regex.test(player.nickname);
    },
  );
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={value}
        placeholder="search"
        onChange={(e) => setValue(e.target.value)}
      />
      {possiblePlayers.length === 0 && players.length === 0 && (
        <p className="pl-[10%] pt-4 text-sm text-muted-foreground">
          nobody in your club yet! <br />
          go add some new people
        </p>
      )}
      <ScrollArea className="rounded-2 h-[79svh]">
        <Table>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow
                key={player.id}
                onClick={() =>
                  handleAddPlayer({ type: 'existing', id: player.id })
                }
                className="p-0"
              >
                <TableCell>{player.nickname}</TableCell>
                <TableCell>{player.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default AddPlayer;
