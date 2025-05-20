import { acceptAffiliation } from '@/server/actions/player-affiliation';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationAcceptMutation({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: acceptAffiliation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [data.club_id, 'club', 'notifications'],
      });
    },
    onError: () => toast.error(t('server error')),
  });
}
