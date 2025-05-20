import { useTRPC } from '@/components/trpc/client';
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
  const trpc = useTRPC();
  return useMutation({
    mutationFn: deleteClub,
    onSuccess: (_error, { id, userId }) => {
      queryClient.removeQueries({ queryKey: [id, 'club'], exact: false });

      // Handle user-related queries
      queryClient.invalidateQueries({ queryKey: [userId, 'user', 'clubs'] });
      queryClient.invalidateQueries({
        queryKey: trpc.user.userAuth.queryKey(),
      });
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
