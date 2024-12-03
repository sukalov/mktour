import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { addExistingPlayer } from '@/lib/actions/tournament-managing';
import { generateRoundRobinRoundFunction } from '@/lib/client-actions/round-robin-generator';
import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { shuffleImmutable } from '@/lib/utils';
import { GameModel, PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useTournamentAddExistingPlayer = (
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
    onError: (err, data, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(
          [tournamentId, 'players', 'added'],
          context.previousState,
        );
      }
      console.log(err);
      toast.error(t('add-player-error', { player: data.player.nickname }), {
        id: `add-player-error-${data.player.id}`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players'],
      });
    },
    onSuccess: (_err, _data, context) => {
      sendJsonMessage({ type: 'add-existing-player', body: context.newPlayer });
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
          'all',
        ]) as GameModel[],
        roundNumber: 1,
        tournamentId,
      });
      saveRound.mutate({ tournamentId, roundNumber: 1, newGames });
      queryClient.setQueryData(
        [tournamentId, 'games', { roundNumber: 1 }],
        () => newGames.sort((a, b) => a.game_number - b.game_number),
      );
    },
  });
};
