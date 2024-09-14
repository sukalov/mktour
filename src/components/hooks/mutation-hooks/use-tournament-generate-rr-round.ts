import { generateRoundRobinRound } from '@/lib/actions/tournament-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useGenerateRoundRobinRound(queryClient: QueryClient) {
  const t = useTranslations('Toasts')
  return useMutation({
    mutationFn: generateRoundRobinRound,
    onSuccess: (data, { tournamentId, roundNumber }) => {
      toast.success(t('round generated'));
      queryClient.setQueryData([tournamentId, 'games', roundNumber], data)
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
