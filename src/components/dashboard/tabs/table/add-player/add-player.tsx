import { DrawerProps } from '@/components/dashboard/tabs/table/add-player';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import {
  DatabasePlayerSlice,
  useTournamentStore,
} from '@/lib/hooks/use-tournament-store';
import { FC } from 'react';

const AddPlayer: FC<DrawerProps> = ({ value, handleAddPlayer }) => {
  const { possiblePlayers } = useTournamentStore();
  const filteredPlayers = possiblePlayers.filter(
    (player: DatabasePlayerSlice) => {
      const regex = new RegExp(value, 'i');
      if (value === '') return player;
      return regex.test(player.nickname);
    },
  );
  return (
    <Table>
      <TableBody>
        {filteredPlayers.map((player) => (
          <TableRow
            key={player.id}
            onClick={() => handleAddPlayer({ id: player.id })}
            className="p-0"
          >
            <TableCell>{player.nickname}</TableCell>
            <TableCell>{player.rating}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AddPlayer;
