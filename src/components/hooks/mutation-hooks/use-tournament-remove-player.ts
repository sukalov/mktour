import { removePlayer } from '@/lib/actions/tournament-managing';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useTournamentRemovePlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) => {
  return useMutation({
    mutationKey: [tournamentId, 'players', 'remove'],
    mutationFn: removePlayer,
    onMutate: async ({ playerId }) => {
      await queryClient.cancelQueries({ queryKey: [tournamentId, 'players'] });
      const previousState: Array<DatabasePlayer> | undefined =
        queryClient.getQueryData([tournamentId, 'players', 'added']);

      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (cache: Array<DatabasePlayer>) =>
          cache.filter((player) => player.id !== playerId),
      );
      return { previousState };
    },
    onError: (_err, _, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [tournamentId, 'players', 'added'],
          context.previousState,
        );
      }
      toast.error("sorry! could't remove player from the tournament", {
        id: 'remove-player-error',
        duration: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [tournamentId, 'players'] });
    },
    onSuccess: (_err, data) => {
      console.log('player removed');
      sendJsonMessage({ type: 'remove-player', id: data.playerId });
    },
  });
};
