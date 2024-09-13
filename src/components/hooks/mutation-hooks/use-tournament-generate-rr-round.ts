import { generateRoundRobinRound } from '@/lib/actions/bracket-generation';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useGenerateRoundRobinRound(queryClient: QueryClient) {
  return useMutation({
    mutationFn: generateRoundRobinRound,
    onSuccess: (_error, { tournamentId }) => {
      toast.success('round generated');
      queryClient.invalidateQueries({ queryKey: [tournamentId, 'games'] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
