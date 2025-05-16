import { requestAffiliation } from '@/lib/actions/player-affiliation';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationRequestMutation() {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: requestAffiliation,
    onSuccess: () => {
      toast.success(t('affiliation requested'));
    },
    onError: (error) => toast.error(`${t('server error')}: ${error}`),
  });
}
