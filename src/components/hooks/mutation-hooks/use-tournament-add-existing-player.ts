import useSaveRound from '@/components/hooks/mutation-hooks/use-tournament-save-round';
import { useTRPC } from '@/components/trpc/client';
import { generateRandomRoundGames } from '@/lib/client-actions/random-pairs-generator';
import { PlayerModel } from '@/types/tournaments';
import { DashboardMessage } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export const useTournamentAddExistingPlayer = (
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: DashboardMessage) => void,
) => {
  const t = useTranslations('Errors');
  const trpc = useTRPC();
  const saveRound = useSaveRound({
    queryClient,
    sendJsonMessage,
    isTournamentGoing: false,
  });
  return useMutation(
    trpc.tournament.addExistingPlayer.mutationOptions({
      onMutate: async ({ player }) => {
        await queryClient.cancelQueries({
          queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
        });
        await queryClient.cancelQueries({
          queryKey: trpc.tournament.playersOut.queryKey({ tournamentId }),
        });
        const previousState = queryClient.getQueryData(
          trpc.tournament.playersIn.queryKey({ tournamentId }),
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
          pairingNumber: null,
        };

        queryClient.setQueryData(
          trpc.tournament.playersIn.queryKey({ tournamentId }),
          (cache) => cache && cache.concat(newPlayer),
        );
        queryClient.setQueryData(
          trpc.tournament.playersOut.queryKey({ tournamentId }),
          (cache) => cache && cache.filter((pl) => pl.id !== player.id),
        );
        return { previousState, newPlayer };
      },
      onError: (err, data, context) => {
        if (context?.previousState) {
          queryClient.setQueryData(
            trpc.tournament.playersIn.queryKey({ tournamentId }),
            context.previousState,
          );
        }
        console.log(err);
        toast.error(t('add-player-error', { player: data.player.nickname }), {
          id: `add-player-error-${data.player.id}`,
        });
      },
      onSettled: () => {
        if (
          queryClient.isMutating({
            mutationKey: trpc.tournament.addExistingPlayer.mutationKey(),
          }) === 1
        ) {
          queryClient.invalidateQueries({
            queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
          });
          queryClient.invalidateQueries({
            queryKey: trpc.tournament.playersOut.queryKey({ tournamentId }),
          });
        }
      },
      onSuccess: (_err, _data, context) => {
        sendJsonMessage({
          type: 'add-existing-player',
          body: context.newPlayer,
        });
        if (
          queryClient.isMutating({
            mutationKey: trpc.tournament.addExistingPlayer.mutationKey(),
          }) === 1
        ) {
          const players = queryClient.getQueryData(
            trpc.tournament.playersIn.queryKey({ tournamentId }),
          );
          const newGames = generateRandomRoundGames({
            players: players
              ? players?.map((player, i) => ({
                  ...player,
                  pairingNumber: i,
                }))
              : [],
            games: [],
            roundNumber: 1,
            tournamentId,
          });
          saveRound.mutate({ tournamentId, roundNumber: 1, newGames });
          queryClient.setQueryData(
            trpc.tournament.roundGames.queryKey({
              tournamentId,
              roundNumber: 1,
            }),
            () => newGames.sort((a, b) => a.game_number - b.game_number),
          );
        }
      },
    }),
  );
};
