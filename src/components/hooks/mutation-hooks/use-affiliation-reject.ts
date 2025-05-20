import { rejectAffiliation } from '@/server/actions/player-affiliation';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationRejectMutation({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: rejectAffiliation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [data.club_id, 'club', 'notifications'],
      });
    },
    onError: () => toast.error(t('server error')),
  });
}
