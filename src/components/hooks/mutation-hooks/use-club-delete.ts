import { deleteClub } from '@/lib/actions/club-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useDeleteClubMutation(queryClient: QueryClient) {
  return useMutation({
    mutationFn: deleteClub,
    onSuccess: (_error, { id, userId }) => {
      toast.success('club deleted');
      queryClient.removeQueries({ queryKey: [id, 'club'] });
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'clubs'] });
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'profile'] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}