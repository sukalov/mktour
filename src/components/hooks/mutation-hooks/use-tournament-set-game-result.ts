'use client';

import { setTournamentGameResult } from '@/lib/actions/tournament-managing';
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
    mutationFn: setTournamentGameResult,
    onSuccess: (fnReturn, { gameId, result, roundNumber }) => {
      if (fnReturn === 'TOURNAMENT_NOT_STARTED') {
        toast.error(t('tmt-not-started error'));
        return;
      }
      queryClient.setQueryData(
        [tournamentId, 'games', { roundNumber }],
        (cache: Array<DatabaseGame>) => {
          const index = cache.findIndex((obj) => obj.id == gameId);
          if (cache[index].result === result) {
            cache[index].result = null;
            return cache;
          }
          cache[index].result = result;
          return cache;
        },
      );
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
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
