import { cancelAffiliationByUser } from '@/lib/actions/player-affiliation';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useAffiliationCancelByUserMutation() {
  const t = useTranslations('Toasts');
  return useMutation({
    mutationFn: cancelAffiliationByUser,
    onSuccess: () => {
      toast.success(t('affiliation canceled'));
    },
    onError: (error) => toast.error(`${t('server error')}: ${error}`),
  });
}
