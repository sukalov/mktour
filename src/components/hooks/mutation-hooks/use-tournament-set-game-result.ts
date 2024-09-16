'use client';

import { setTournamentGameResult } from '@/lib/actions/tournament-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentSetGameResult(
  queryClient: QueryClient,
  { tournamentId }: { tournamentId: string | undefined },
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: setTournamentGameResult,
    onSuccess: (_error) => {
      toast.success(t('result added'));
      queryClient.invalidateQueries({ queryKey: [tournamentId, 'games'] });
    },
    onError: (error) => {
      toast.error(t('server error'));
      console.log(error);
    },
  });
}
