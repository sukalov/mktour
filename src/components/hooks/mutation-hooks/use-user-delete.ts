import { deleteUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useDeleteUserMutation(queryClient: QueryClient) {
    const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_error, { userId }) => {
      toast.success(t('user deleted'));
      queryClient.invalidateQueries({ queryKey: [userId] });
    },
    onError: () => toast.error(t('server error')),
  });
}
