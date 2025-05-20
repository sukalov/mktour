import { useTRPC } from '@/components/trpc/client';
import { editUser } from '@/server/actions/profile-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useEditUserMutation(queryClient: QueryClient) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      toast.success(t('profile updated'));
      queryClient.invalidateQueries({
        queryKey: trpc.user.userAuth.queryKey(),
      });
    },
    onError: () => toast.error(t('server error')),
  });
}
