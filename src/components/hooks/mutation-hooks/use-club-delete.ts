import { deleteClub } from '@/lib/actions/club-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useDeleteClubMutation(queryClient: QueryClient) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: deleteClub,
    onSuccess: (_error, { id, userId }) => {
      toast.success('club deleted');
      queryClient.removeQueries({ queryKey: [id, 'club'] });
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'clubs'] });
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'profile'] });
    },
    onError: (error) => {
      if (error.message === 'ZERO_CLUBS') {
        toast.error(t('zero clubs error', { id: 'zeroClubsError' }));
      } else {
        toast.error('sorry! server error happened', { id: 'serverError' });
      }
    },
  });
}
