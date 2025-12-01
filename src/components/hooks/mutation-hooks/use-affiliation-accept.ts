import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationAcceptMutation({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.player.affiliation.accept.mutationOptions({
      onSuccess: (_data, { clubId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.club.notifications.all.queryKey({ clubId }),
        });
      },
      onError: () => toast.error(t('server error')),
    }),
  );
}
