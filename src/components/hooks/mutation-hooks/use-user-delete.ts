import { deleteUser } from '@/lib/actions/profile-managing';
import { useTRPC } from '@/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useDeleteUserMutation(queryClient: QueryClient) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success(t('user deleted'));
      queryClient.invalidateQueries({ queryKey: trpc.user.pathKey() });
    },
    onError: () => toast.error(t('server error')),
  });
}
