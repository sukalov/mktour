import { editUser } from '@/lib/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useEditUserMutation(queryClient: QueryClient) {
  const t = useTranslations('Toasts')
  return useMutation({
    mutationFn: editUser,
    onSuccess: (_err, data) => {
      toast.success(t('profile updated'));
      queryClient.invalidateQueries({ queryKey: [data.id, 'user', 'profile'] });
    },
    onError: () => toast.error(t('server error')),
  });
}
