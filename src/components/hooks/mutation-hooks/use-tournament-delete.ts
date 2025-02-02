'use client';

import { deleteTournament } from '@/lib/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useTournamentDelete(
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) {
  const t = useTranslations('Toasts');
  const router = useRouter();
  return useMutation({
    mutationFn: () => deleteTournament({ tournamentId }),
    onSuccess: () => {
      sendJsonMessage({ type: 'delete-tournament' });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
      router.push('/tournaments/all');
      router.refresh();
    },
    onError: () => {
      toast.error(t('server error'));
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players'],
      });
    },
  });
}
