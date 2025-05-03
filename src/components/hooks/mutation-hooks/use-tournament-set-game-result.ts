'use client';

import { SetGameResultBody } from '@/app/api/tournament/[id]/set-game-result/route';
import { DatabaseGame } from '@/lib/db/schema/tournaments';
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
    onSuccess: (res, { gameId, result, roundNumber }) => {
      if (res.error === 'TOURNAMENT_NOT_STARTED') {
        toast.error(t('tmt-not-started error'));
        return;
      }
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
