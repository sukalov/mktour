import { useTRPC } from '@/components/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationAbortRequestMutation() {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.player.affiliation.abortRequest.mutationOptions({
      onSuccess: () => {
        toast.success(t('affiliation canceled'));
      },
      onError: (error) => toast.error(`${t('server error')}: ${error}`),
    }),
  );
}
