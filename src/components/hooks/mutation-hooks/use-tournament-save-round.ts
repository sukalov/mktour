import { saveRound } from '@/lib/actions/tournament-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useSaveRound(queryClient: QueryClient) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: saveRound,
    onSuccess: (_data, { tournamentId, roundNumber }) => {
      return queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games', { roundNumber }],
      });
    },
    onSettled: () => {
      console.log('после конца мутации:')
      console.log(queryClient.getQueryCache().getAll()[4].state.data)},
    onError: () => toast.error(t('server error')),
  });
}
