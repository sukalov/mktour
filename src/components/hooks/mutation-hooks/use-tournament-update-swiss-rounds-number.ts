'use client';

import { useTRPC } from '@/components/trpc/client';
import { DashboardMessage } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentSaveRoundsNumber(
  queryClient: QueryClient,
  sendJsonMessage: (_message: DashboardMessage) => void,
) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.tournament.updateSwissRoundsNumber.mutationOptions({
      onSuccess: (_, { roundsNumber }) => {
        sendJsonMessage({ type: 'swiss-new-rounds-number', roundsNumber });
        queryClient.setQueryData(
          trpc.tournament.info.queryKey(),
          (cache) =>
            cache && {
              ...cache,
              rounds_number: roundsNumber,
            },
        );
        queryClient.invalidateQueries({
          queryKey: trpc.tournament.pathKey(),
        });
      },
      onError: (e) => {
        toast.error(t('server error'));
        console.log(e);
        queryClient.invalidateQueries({
          queryKey: trpc.tournament.pathKey(),
        });
      },
    }),
  );
}
