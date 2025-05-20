import { abortAffiliationRequest } from '@/server/mutations/player-affiliation';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationAbortRequestMutation() {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: abortAffiliationRequest,
    onSuccess: () => {
      toast.success(t('affiliation canceled'));
    },
    onError: (error) => toast.error(`${t('server error')}: ${error}`),
  });
}
