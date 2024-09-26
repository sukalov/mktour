import { saveRound } from '@/lib/actions/tournament-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useSaveRound(queryClient: QueryClient) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: saveRound,
    onSuccess: (_data, { tournamentId, roundNumber }) => {
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games', { roundNumber }],
      });
    },
    onError: () => toast.error(t('server error')),
  });
}
