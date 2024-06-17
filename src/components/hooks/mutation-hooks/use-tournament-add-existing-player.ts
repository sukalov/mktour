import { addExistingPlayer } from '@/lib/actions/tournament-managing';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useTournamentAddExistingPlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) => {
  return useMutation({
    mutationKey: [tournamentId, 'players', 'add-existing'],
    mutationFn: addExistingPlayer,
    onMutate: async ({ player }) => {
      await queryClient.cancelQueries({
        queryKey: [tournamentId, 'players'],
      });
      const previousState: Array<DatabasePlayer> | undefined =
        queryClient.getQueryData([tournamentId, 'players', 'added']);

      const newPlayer: PlayerModel = {
        id: player.id,
        nickname: player.nickname,
        rating: player.rating,
        realname: player.realname,
        wins: 0,
        losses: 0,
        draws: 0,
        color_index: 0,
        place: null,
        exited: null,
      };

      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (cache: Array<PlayerModel>) => cache.concat(newPlayer),
      );
      queryClient.setQueryData(
        [tournamentId, 'players', 'possible'],
        (cache: Array<PlayerModel>) =>
          cache.filter((pl) => pl.id !== player.id),
      );
      return { previousState, newPlayer };
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
        queryKey: [tournamentId, 'players'],
      });
    },
    onSuccess: (_err, _data, context) => {
      sendJsonMessage({ type: 'add-existing-player', body: context.newPlayer });
    },
  });
};
