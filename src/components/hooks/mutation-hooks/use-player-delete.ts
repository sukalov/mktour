import { deletePlayer } from '@/lib/actions/club-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// FIXME
export default function useDeletePlayerMutation(queryClient: QueryClient) {
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: (_error, id) => {
      toast.success('player deleted'); // FIXME intl
      queryClient.removeQueries({ queryKey: [id, 'club', 'players'] });
      queryClient.invalidateQueries({
        queryKey: [id, 'club', 'players'],
      });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
