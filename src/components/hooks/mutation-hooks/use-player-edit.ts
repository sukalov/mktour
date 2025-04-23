import { editPlayer } from '@/lib/actions/club-managing';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useEditPlayerMutation(_queryClient: QueryClient) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: editPlayer,
    onSuccess: () => {
      toast.success(t('player updated'));
    },
    onError: () => toast.error(t('server error')),
  });
}
