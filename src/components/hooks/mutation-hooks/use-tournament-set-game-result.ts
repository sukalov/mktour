'use client';

import { setTournamentGameResult } from '@/lib/actions/tournament-managing';
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
    onSuccess: (fnReturn, { gameId, result }) => {
      if (fnReturn === 'TOURNAMENT_NOT_STARTED') {
        toast.error(t('tmt-not-started error'));
        return;
      }
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
      });
      console.log('result added');
      sendJsonMessage({ type: 'set-game-result', gameId, result });
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
