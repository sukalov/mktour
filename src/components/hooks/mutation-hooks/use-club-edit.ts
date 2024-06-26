import { editClub } from '@/lib/actions/club-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useEditClubMutation(queryClient: QueryClient) {
  return useMutation({
    mutationFn: editClub,
    onSuccess: (_error, { id }) => {
      toast.success('club updated');
      queryClient.invalidateQueries({ queryKey: [id, 'club'] });
      queryClient.invalidateQueries({ queryKey: ['user', 'clubs'] });
    },
    onError: () => toast.error('sorry! server error happened'),
  });
}
