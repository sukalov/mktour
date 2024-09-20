'use client';

import { setTournamentStatus } from '@/lib/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentSetStatus(
  queryClient: QueryClient,
  { tournamentId, sendJsonMessage }: SetStatusProps,
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: setTournamentStatus,
    onSuccess: (_error, { started_at, closed_at }) => {
      if (closed_at) toast.success(t('ended'));
      if (started_at) toast.success(t('started'));
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
      sendJsonMessage({ type: 'set-status', tournamentId });
    },
    onError: (error) => {
      toast.error(t('server error'));
      console.log(error);
    },
  });
}

type SetStatusProps = {
  tournamentId: string | undefined;
  sendJsonMessage: (_message: Message) => void;
};
