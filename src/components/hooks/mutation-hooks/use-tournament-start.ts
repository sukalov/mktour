'use client';

import { useTRPC } from '@/components/trpc/client';
import { DashboardMessage } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentStart(
  queryClient: QueryClient,
  { sendJsonMessage }: SetStatusProps,
) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation(
    trpc.tournament.start.mutationOptions({
      onSuccess: (_error, { started_at, rounds_number }) => {
        if (started_at) {
          toast.success(t('started'));
          sendJsonMessage({
            type: 'start-tournament',
            started_at,
            rounds_number,
          });
        }
        queryClient.invalidateQueries({
          queryKey: trpc.tournament.pathKey(),
        });
      },
      onError: (error) => {
        toast.error(t('server error'));
        console.log(error);
      },
    }),
  );
}

type SetStatusProps = {
  tournamentId: string | undefined;
  sendJsonMessage: (_message: DashboardMessage) => void;
};
