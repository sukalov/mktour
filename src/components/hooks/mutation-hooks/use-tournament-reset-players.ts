'use client';

import { resetTournamentPlayers } from '@/lib/actions/tournament-managing';
import { useTRPC } from '@/trpc/client';
import { Message } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export default function useTournamentReset(
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: Message) => void,
  setRoundInView: Dispatch<SetStateAction<number>>,
) {
  const t = useTranslations('Toasts');
  const trpc = useTRPC();
  return useMutation({
    mutationFn: resetTournamentPlayers,
    onSuccess: () => {
      sendJsonMessage({ type: 'reset-tournament' });
      queryClient.invalidateQueries({
        queryKey: trpc.tournament.pathKey(),
      });

      setRoundInView(1);
    },
    onError: () => {
      toast.error(t('server error'));
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'tournament'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'games'],
      });
      queryClient.invalidateQueries({
        queryKey: [tournamentId, 'players'],
      });
    },
  });
}
