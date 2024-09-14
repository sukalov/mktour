import { generateRoundRobinRound } from '@/lib/actions/tournament-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useGenerateRoundRobinRound(queryClient: QueryClient) {
  return useMutation({
    mutationFn: generateRoundRobinRound,
    onSuccess: (data, { tournamentId, roundNumber }) => {
      toast.success(`round generated ${tournamentId}`);
      queryClient.setQueryData([tournamentId, 'games', roundNumber], data)
      // queryClient.invalidateQueries({ queryKey: [tournamentId, 'games', roundNumber] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
