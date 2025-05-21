import { useTRPC } from '@/components/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationRequestMutation() {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.player.affiliation.request.mutationOptions({
      onSuccess: () => {
        toast.success(t('affiliation requested'));
      },
      onError: (error) => toast.error(`${t('server error')}: ${error}`),
    }),
  );
}
