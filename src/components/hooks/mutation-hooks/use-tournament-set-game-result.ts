'use client';

import { SetGameResultBody } from '@/app/api/tournament/[id]/set-game-result/route';
import { DatabaseGame } from '@/lib/db/schema/tournaments';
import { PlayerModel } from '@/types/tournaments';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentSetGameResult(
  queryClient: QueryClient,
  { tournamentId, sendJsonMessage }: SetResultProps,
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationKey: [tournamentId, 'set-game-result'],
    mutationFn: async (body: SetGameResultBody) => {
      const res = await fetch(
        `/api/tournament/${tournamentId}/set-game-result`,
        {
          method: 'POST',
          body: JSON.stringify(body),
        },
      );
      return res.json() as Promise<{ success: boolean; error?: string }>;
    },
    onMutate: async ({ roundNumber }) => {
      await queryClient.cancelQueries({
        queryKey: [tournamentId, 'games', { roundNumber }],
      });
      await queryClient.cancelQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
    },
    onSuccess: (
      res,
      { gameId, result, roundNumber, prevResult, whiteId, blackId },
    ) => {
      if (res.error === 'TOURNAMENT_NOT_STARTED') {
        toast.error(t('tmt-not-started error'));
        return;
      }
      function updatePlayerStats(
        player: PlayerModel,
        result: string,
        isWhite: boolean,
        isReset: boolean,
      ) {
        const modifier = isReset ? -1 : 1;

        const updatedPlayer = { ...player };

        if (result === '1-0') {
          if (isWhite) {
            updatedPlayer.wins = (updatedPlayer.wins || 0) + modifier;
          } else {
            updatedPlayer.losses = (updatedPlayer.losses || 0) + modifier;
          }
        } else if (result === '0-1') {
          if (isWhite) {
            updatedPlayer.losses = (updatedPlayer.losses || 0) + modifier;
          } else {
            updatedPlayer.wins = (updatedPlayer.wins || 0) + modifier;
          }
        } else if (result === '1/2-1/2') {
          updatedPlayer.draws = (updatedPlayer.draws || 0) + modifier;
        }
        return updatedPlayer;
      }

      // as soon as we made games order dependent on player scores,
      // we need to update their scores at the same time as we update games
      // otherwise ui flickers and adds wrong order for a moment
      // while games are updated and players are being refetched
      queryClient.setQueryData(
        [tournamentId, 'players', 'added'],
        (players: PlayerModel[]) => {
          if (!players || !result) return players;
          return players.map((player) => {
            // Case 1: Toggling the same result (reset)
            if (prevResult === result) {
              if (player.id === whiteId) {
                return updatePlayerStats(player, result, true, true);
              }
              if (player.id === blackId) {
                return updatePlayerStats(player, result, false, true);
              }
            }
            // Case 2: Changing from one result to another
            else if (prevResult && prevResult !== result) {
              if (player.id === whiteId) {
                // First remove old result
                const updated = updatePlayerStats(
                  player,
                  prevResult,
                  true,
                  true,
                );
                // Then add new result
                return updatePlayerStats(updated, result, true, false);
              }
              if (player.id === blackId) {
                // First remove old result
                const updated = updatePlayerStats(
                  player,
                  prevResult,
                  false,
                  true,
                );
                // Then add new result
                return updatePlayerStats(updated, result, false, false);
              }
            }
            // Case 3: Adding a new result where none existed before
            else if (!prevResult && result) {
              if (player.id === whiteId) {
                return updatePlayerStats(player, result, true, false);
              }
              if (player.id === blackId) {
                return updatePlayerStats(player, result, false, false);
              }
            }
            return player;
          });
        },
      );

      queryClient.setQueryData(
        [tournamentId, 'games', { roundNumber }],
        (cache: Array<DatabaseGame>) => {
          return cache.map((game) => {
            if (game.id === gameId) {
              return {
                ...game,
                result: game.result === result ? null : result,
              };
            }
            return game;
          });
        },
      );
      if (
        queryClient.isMutating({
          mutationKey: [tournamentId, 'set-game-result'],
        }) === 1
      ) {
        queryClient.invalidateQueries({
          queryKey: [tournamentId, 'games', { roundNumber }],
        });
        queryClient.invalidateQueries({
          queryKey: [tournamentId, 'players', 'added'],
        });
      }
      sendJsonMessage({ type: 'set-game-result', gameId, result, roundNumber });
    },
    onError: (error) => {
      toast.error(t('server error'));
      console.log(error);
    },
  });
}

type SetResultProps = {
  tournamentId: string | undefined;
  sendJsonMessage: (_message: Message) => void;
};
