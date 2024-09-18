import { DashboardContext } from '@/app/tournaments/[id]/dashboard/dashboard-context';
import { DrawerProps } from '@/app/tournaments/[id]/dashboard/tabs/table/add-player';
import { useTournamentAddExistingPlayer } from '@/components/hooks/mutation-hooks/use-tournament-add-existing-player';
import { useTournamentPossiblePlayers } from '@/components/hooks/query-hooks/use-tournament-possible-players';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

const AddPlayer = ({ setOpen, value, setValue }: DrawerProps) => {
  const id = usePathname().split('/').at(-1) as string;
  const possiblePlayers = useTournamentPossiblePlayers(id);
  const queryClient = useQueryClient();
  const { sendJsonMessage, userId } = useContext(DashboardContext);
  const { mutate } = useTournamentAddExistingPlayer(
    id,
    queryClient,
    sendJsonMessage,
  );
  const t = useTranslations('Errors');
  useHotkeys('escape', () => setOpen(false), { enableOnFormTags: true });

  if (possiblePlayers.status === 'pending')
    return (
      <div className="flex flex-col gap-3">
        <Input
          id="possible-players-search"
          value={value}
          placeholder="search"
          onChange={(e) => setValue(e.target.value)}
        />
        <Skeleton className="h-svh w-full pt-8" />
      </div>
    );
  if (possiblePlayers.status === 'error') {
    toast.error(t('possible players error'), {
      id: 'query-possible-players',
      duration: 3000,
    });
    return (
      <div className="flex flex-col gap-3">
        <Input
          id="possible-players-search"
          value={value}
          placeholder="search"
          onChange={(e) => setValue(e.target.value)}
        />
        <Skeleton className="h-svh w-full pt-8" />
      </div>
    );
  }

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
        id="possible-players-search"
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
                  if (!userId) {
                    console.log('not found user id in context');
                    return;
                  }
                  setValue('');
                  mutate({ tournamentId: id, player, userId });
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
