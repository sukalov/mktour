'use client';

import { useTRPC } from '@/components/trpc/client';
import { finishTournament } from '@/server/actions/tournament-managing';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function useTournamentFinish(
  queryClient: QueryClient,
  { tournamentId, sendJsonMessage }: SetStatusProps,
) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation({
    mutationFn: finishTournament,
    onSuccess: (_error, { closed_at }) => {
      if (closed_at) {
        toast.success(t('finished'));
        sendJsonMessage({
          type: 'finish-tournament',
          closed_at,
        });
      }
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.info.queryKey({ tournamentId }),
      });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.playersIn.queryKey({ tournamentId }),
      });
    },
    onError: (error) => {
      toast.error(t('server error'));
      console.log(error);
    },
  });
}

type SetStatusProps = {
  tournamentId: string | undefined;
  sendJsonMessage: (_message: Message) => void;
};
