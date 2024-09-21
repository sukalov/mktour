'use client';

import { resetTournament } from '@/lib/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentReset(
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: resetTournament,
    onSuccess: () => {
      toast.success(t('started'));
      sendJsonMessage({ type: 'reset-tournament' });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
    },
    onError: (error) => {
        toast.error(`{${t('server error')} - ${error.message}`);
      console.log(error);
    },
  });
}
