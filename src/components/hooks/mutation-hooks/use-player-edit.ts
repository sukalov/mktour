import { useTRPC } from '@/components/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useEditPlayerMutation() {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.player.edit.mutationOptions({
      onSuccess: () => {
        toast.success(t('player updated'));
      },
      onError: () => toast.error(t('server error')),
    }),
  );
}
