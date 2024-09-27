import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { addNewPlayer } from '@/lib/actions/tournament-managing';
import { generateRoundRobinRoundFunction } from '@/lib/client-actions/round-robin-generator';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { shuffleImmutable } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import {
  QueryClient,
  useMutation
} from '@tanstack/react-query';
import { toast } from 'sonner';

export const useTournamentAddNewPlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
  returnToNewPlayer: (_player: DatabasePlayer) => void,
) => {
  const saveRound = useSaveRound(queryClient, sendJsonMessage);
  return useMutation({
    mutationKey: [tournamentId, 'players', 'add-new'],
    mutationFn: addNewPlayer,
    onMutate: async ({ player }) => {
      await queryClient.cancelQueries({
        queryKey: [tournamentId, 'players', 'added'],
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
      return { previousState, newPlayer };
    },
    onError: (_err, data, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [tournamentId, 'players', 'added'],
          context.previousState,
        );
      }
      setTimeout(() => {
        returnToNewPlayer(data.player);
        toast.error(
          `sorry! couldn't add ${data.player.nickname} to the tournament`,
          {
            id: `add-player-error-${data.player.id}`,
          },
        );
      }, 1000);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
    },
    onSuccess: (_err, _data, context) => {
      sendJsonMessage({ type: 'add-new-player', body: context.newPlayer });
        const newGames = generateRoundRobinRoundFunction({
          players: shuffleImmutable(
            queryClient.getQueryData([
              tournamentId,
              'players',
              'added',
            ]) as PlayerModel[],
          ),
          games: queryClient.getQueryData([
            tournamentId,
            'games',
          ]) as GameModel[],
          roundNumber: 1,
          tournamentId,
        });
        saveRound.mutate({ tournamentId, newGames, roundNumber: 1 });
        queryClient.setQueryData(
          [tournamentId, 'games', { roundNumber: 1 }],
          () => newGames.sort((a, b) => a.game_number - b.game_number),
        );
    },
  });
};
