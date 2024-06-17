import { useTournamentPossiblePlayers } from '@/components/hooks/query-hooks/use-tournament-possible-players';
import { useTournamentPlayers } from '@/components/hooks/query-hooks/use-tournament-players';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

const AddPlayer: FC<any> = ({ handleAddPlayer, value, setValue }) => {
  const id = usePathname().split('/').at(-1) as string;
  const possiblePlayers = useTournamentPossiblePlayers(id);
  const players = useTournamentPlayers(id);
  if (players.isLoading || possiblePlayers.isLoading) return 'loading...';
  if (players.isError || possiblePlayers.isLoading) return 'error...';

  const filteredPlayers = possiblePlayers.data?.filter(
    (player: DatabasePlayer) => {
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
      {possiblePlayers.data?.length === 0 && players.data?.length === 0 && (
        <p className="pl-[10%] pt-4 text-sm text-muted-foreground">
          nobody in your club yet! <br />
          go add some new people
        </p>
      )}
      <ScrollArea className="rounded-2 h-[79svh]">
        <Table>
          <TableBody>
            {filteredPlayers?.map((player) => (
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
