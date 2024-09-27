import { saveRound } from '@/lib/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import {
  QueryClient,
  useMutation,
  useMutationState,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useSaveRound(
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
) {
  const t = useTranslations('Toasts');
  const state = useMutationState({
    filters: {
      status: 'pending',
    },
  });
  return useMutation({
    mutationKey: [tournamentId, 'save-round'],
    mutationFn: saveRound,
    onSuccess: (_data, { tournamentId, roundNumber, newGames }) => {
      if (state.length === 1) {
        sendJsonMessage({ type: 'new-round', newGames });
        queryClient.invalidateQueries({
          queryKey: [tournamentId, 'games', { roundNumber }],
        });
      }
    },
    onError: () => toast.error(t('server error')),
  });
}
