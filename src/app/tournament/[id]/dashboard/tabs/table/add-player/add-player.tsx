
import { DashboardContext } from '@/app/tournament/[id]/dashboard/dashboard-context';
import { DrawerProps } from '@/app/tournament/[id]/dashboard/tabs/table/add-player';
import { useTournamentAddExistingPlayer } from '@/components/hooks/mutation-hooks/use-tournament-add-existing-player';
import { useTournamentPossiblePlayers } from '@/components/hooks/query-hooks/use-tournament-possible-players';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';

const AddPlayer = ({ setOpen, value, setValue }: DrawerProps) => {
  const id = usePathname().split('/').at(-1) as string;
  const possiblePlayers = useTournamentPossiblePlayers(id);
  const queryClient = useQueryClient();
  const { sendJsonMessage } = useContext(DashboardContext);
  const { mutate } = useTournamentAddExistingPlayer(
    id,
    queryClient,
    sendJsonMessage,
  );

  if (possiblePlayers.status === 'pending') return 'loading...';
  if (possiblePlayers.status === 'error') return 'success';

  const filteredPlayers = possiblePlayers.data.filter(
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
      {possiblePlayers.data?.length === 0 && (
        <p className="pl-[10%] pt-4 text-sm text-muted-foreground">
          nobody here yet! <br />
          go add some new people
        </p>
      )}
      <ScrollArea className="rounded-2 h-[79svh]">
        <Table>
          <TableBody>
            {filteredPlayers?.map((player) => (
              <TableRow
                key={player.id}
                onClick={() => {
                  setOpen(false);
                  mutate({ tournamentId: id, player });
                }}
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
