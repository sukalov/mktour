'use client';

import { finishTournament } from '@/lib/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentFinish(
  queryClient: QueryClient,
  { tournamentId, sendJsonMessage }: SetStatusProps,
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: finishTournament,
    onSuccess: (_error, { closed_at }) => {
      if (closed_at) {
        toast.success(t('finished'));
        sendJsonMessage({
          type: 'finish-tournament',
          closed_at,
        });
      }
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players', 'added'],
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
