import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { generateRoundRobinRoundFunction } from '@/lib/client-actions/round-robin-generator';
import { DatabasePlayer, InsertDatabasePlayer } from '@/lib/db/schema/players';
import { shuffle } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';
import { PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useTournamentAddNewPlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
  returnToNewPlayer: (_player: InsertDatabasePlayer) => void,
) => {
  const t = useTranslations('Errors');
  const saveRound = useSaveRound({
    queryClient,
    sendJsonMessage,
    isTournamentGoing: false,
  });
  const trpc = useTRPC();
  return useMutation(
    trpc.tournament.addNewPlayer.mutationOptions({
      onMutate: async ({ player }) => {
        await queryClient.cancelQueries({
          queryKey: trpc.tournament.playersIn.queryKey(tournamentId),
        });
        const previousState: Array<DatabasePlayer> | undefined =
          queryClient.getQueryData(
            trpc.tournament.playersIn.queryKey(tournamentId),
          );

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
          is_out: null,
        };

        queryClient.setQueryData(
          trpc.tournament.playersIn.queryKey(tournamentId),
          (cache) => cache && cache.concat(newPlayer),
        );
        return { previousState, newPlayer };
      },
      onError: (_err, data, context) => {
        if (context?.previousState) {
          queryClient.setQueryData(
            trpc.tournament.playersOut.queryKey(tournamentId),
            context.previousState,
          );
        }
        setTimeout(() => {
          returnToNewPlayer(data.player);
          toast.error(t('add-player-error', { player: data.player.nickname }), {
            id: `add-player-error-${data.player.id}`,
          });
        }, 1000);
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.tournament.playersIn.queryKey(tournamentId),
        });
      },
      onSuccess: (_err, _data, context) => {
        sendJsonMessage({ type: 'add-new-player', body: context.newPlayer });
        const playersUnshuffled = queryClient.getQueryData(
          trpc.tournament.playersIn.queryKey(tournamentId),
        );
        const games = queryClient.getQueryData(
          trpc.tournament.allGames.queryKey(tournamentId),
        );
        const newGames = generateRoundRobinRoundFunction({
          players: playersUnshuffled ? shuffle(playersUnshuffled) : [],
          games: games ?? [],
          roundNumber: 1,
          tournamentId,
        });
        saveRound.mutate({ tournamentId, roundNumber: 1, newGames });
        queryClient.setQueryData(
          [tournamentId, 'games', { roundNumber: 1 }],
          () => newGames.sort((a, b) => a.game_number - b.game_number),
        );
      },
    }),
  );
};
