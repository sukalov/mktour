'use client';

import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { QueryClient } from '@tanstack/react-query';
// import { useTournamentStore } from '@/lib/hooks/use-tournament-store';
import { toast } from 'sonner';

export const handleSocketMessage = (
  message: Message,
  queryClient: QueryClient,
  tournamentId: string,
) => {
  switch (message.type) {
    case 'add-new-player':
      useTournamentStore.getState().addNewPlayer(message.body);
      break;
    case 'add-existing-player':
      useTournamentStore.getState().addPlayer(message.id);
      break;
    case 'remove-player':
      const removedPlayer = (
        queryClient.getQueryData([
          'players',
          tournamentId,
          'players-added',
        ]) as Array<DatabasePlayer>
      ).find((player: DatabasePlayer) => player.id === message.id);

      queryClient.setQueryData(
        [tournamentId, 'players', 'players-added'],
        (cache: Array<DatabasePlayer>) =>
          cache.filter((player) => player.id !== message.id),
      );
      if (removedPlayer)
        queryClient.setQueryData(
          [tournamentId, 'players', 'players-possible'],
          (cache: Array<DatabasePlayer>) => cache.concat(removedPlayer),
        );
      queryClient.invalidateQueries({queryKey: [tournamentId, 'players']})
      break;
    case 'error':
      toast.error(`server couldn't do this action "${message.data.type}"`);
    default:
      break;
  }
};
