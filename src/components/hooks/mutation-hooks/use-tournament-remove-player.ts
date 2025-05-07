import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { removePlayer } from '@/lib/actions/tournament-managing';
import { generateRoundRobinRoundFunction } from '@/lib/client-actions/round-robin-generator';
import { DatabasePlayer } from '@/lib/db/schema/players';
import { shuffle } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useTournamentRemovePlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) => {
  const t = useTranslations('Errors');
  const saveRound = useSaveRound({
    tournamentId,
    queryClient,
    sendJsonMessage,
    isTournamentGoing: false,
  });
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
    onError: (err, { playerId }, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [tournamentId, 'players', 'added'],
          context.previousState,
        );
      }
      const player = context?.previousState?.find(
        (player) => player.id === playerId,
      );
      if (!player) {
        toast.error(
          t('internal-error', {
            error: 'player not found in context.previousState',
          }),
          {
            id: 'internal-error',
            duration: 3000,
          },
        );
        return;
      }
      console.log({ err });
      toast.error(
        t('remove-player-error', {
          player: player.nickname,
        }),
        {
          id: 'remove-player-error',
          duration: 3000,
        },
      );
    },
    onSettled: () => {
      if (
        queryClient.isMutating({
          mutationKey: [tournamentId, 'players', 'remove'],
        }) === 1
      ) {
        queryClient.invalidateQueries({ queryKey: [tournamentId, 'players'] });
      }
    },
    onSuccess: (_err, data) => {
      sendJsonMessage({ type: 'remove-player', id: data.playerId });
      if (
        queryClient.isMutating({
          mutationKey: [tournamentId, 'players', 'remove'],
        }) === 1
      ) {
        const newGames = generateRoundRobinRoundFunction({
          players: shuffle(
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
        saveRound.mutate({ tournamentId, roundNumber: 1, newGames });
        queryClient.setQueryData(
          [tournamentId, 'games', { roundNumber: 1 }],
          () => newGames.sort((a, b) => a.game_number - b.game_number),
        );
      }
    },
  });
};
