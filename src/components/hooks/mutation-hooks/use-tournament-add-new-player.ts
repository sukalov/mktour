import { addNewPlayer } from '@/lib/actions/tournament-managing';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useTournamentAddNewPlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) => {
  return useMutation({
    mutationKey: [tournamentId, 'players', 'add-new'],
    mutationFn: addNewPlayer,
    onMutate: async ({ player }) => {
      await queryClient.cancelQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      const previousState: Array<DatabasePlayer> | undefined =
        queryClient.getQueryData([tournamentId, 'players', 'added']);

      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (cache: Array<DatabasePlayer>) => cache.concat(player),
      );
      return { previousState };
    },
    onError: (_err, data, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [tournamentId, 'players', 'added'],
          context.previousState,
        );
      }
      toast.error(
        `sorry! couldn't add ${data.player.nickname} to the tournament`,
        {
          id: `add-player-error-${data.player.id}`,
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
    },
    onSuccess: (_err, { player }) => {
      sendJsonMessage({ type: 'add-new-player', body: player });
    },
  });
};
