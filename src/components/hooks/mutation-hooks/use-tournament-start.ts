'use client';

import { startTournament } from '@/lib/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentStart(
  queryClient: QueryClient,
  { tournamentId, sendJsonMessage }: SetStatusProps,
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: startTournament,
    onSuccess: (_error, { started_at, rounds_number }) => {
      if (started_at) {
        toast.success(t('started'));
        sendJsonMessage({
          type: 'start-tournament',
          started_at,
          rounds_number,
        });
      }
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
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
