import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useTournamentAddNewPlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) => {
  return useMutation({
    mutationKey: [tournamentId, 'players', 'players-add-new'],
    mutationFn: addNewPlayer,
    onMutate: async ({ playerId }) => {
      await queryClient.cancelQueries({ queryKey: ['players'] });
      const previousState: Array<DatabasePlayer> | undefined =
        queryClient.getQueryData([tournamentId, 'players', 'players-added']);

      queryClient.setQueryData(
        [tournamentId, 'players', 'players-added'],
        (cache: Array<DatabasePlayer>) =>
          cache.filter((player) => player.id !== playerId),
      );
      return { previousState };
    },
    onError: (_err, _, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [tournamentId, 'players', 'players-added'],
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
