import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { removePlayer } from '@/lib/actions/tournament-managing';
import { generateRoundRobinRoundFunction } from '@/lib/client-actions/round-robin-generator';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { shuffleImmutable } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useTournamentRemovePlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) => {
  const saveRound = useSaveRound(queryClient, sendJsonMessage);
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
      console.log(_err);
      toast.error("sorry! could't remove player from the tournament", {
        id: 'remove-player-error',
        duration: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [tournamentId, 'players'] });
    },
    onSuccess: (_err, data) => {
      sendJsonMessage({ type: 'remove-player', id: data.playerId });
      const newGames = generateRoundRobinRoundFunction({
        players: shuffleImmutable(
          queryClient.getQueryData([
            tournamentId,
            'players',
            'added',
          ]) as PlayerModel[],
        ),
        games: queryClient.getQueryData([tournamentId, 'games']) as GameModel[],
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
