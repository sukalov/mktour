import { deleteClub } from '@/lib/actions/club-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function useDeleteClubMutation(
  queryClient: QueryClient,
  setOpen: Dispatch<SetStateAction<boolean>>,
) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: deleteClub,
    onSuccess: (_error, { id, userId }) => {
      queryClient.removeQueries({ queryKey: [id, 'club'], exact: false });

      // Handle user-related queries
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'clubs'] });
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'profile'] });
      toast.success('club deleted');
      setOpen(false);
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
