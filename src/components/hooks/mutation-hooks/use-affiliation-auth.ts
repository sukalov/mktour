import { useTRPC } from '@/components/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationAuthMutation() {
  const t = useTranslations('Toasts');
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.player.affiliation.affiliateAuth.mutationOptions({
      onSuccess: (_, { clubId, playerId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.club.authAffiliation.queryKey({ clubId }),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.player.info.queryKey({
            playerId,
          }),
        });
      },
      onError: () => toast.error(t('server error')),
    }),
  );
}
