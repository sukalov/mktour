'use client';

import { useTRPC } from '@/components/trpc/client';
import { DashboardMessage } from '@/types/ws-events';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function useTournamentDelete(
  tournamentId: string,
  queryClient: QueryClient,
  sendJsonMessage: (_message: DashboardMessage) => void,
) {
  const t = useTranslations('Toasts');
  const router = useRouter();
  const trpc = useTRPC();
  return useMutation(
    trpc.tournament.delete.mutationOptions({
      onSuccess: () => {
        sendJsonMessage({ type: 'delete-tournament' });
        router.push('/tournaments/my');
        router.refresh();
        queryClient.cancelQueries({
          queryKey: trpc.tournament.pathKey(),
        });
      },
      onError: (error) => {
        if (error.message !== 'NEXT_REDIRECT') {
          console.error('SERVER_ERROR', error);
          toast.error(t('server error'));
          queryClient.invalidateQueries({
            queryKey: trpc.tournament.pathKey(),
          });
        } else {
          console.log('NEXT_REDIRECT going oon');
          router.push('/tournaments/my');
          router.refresh();
        }
      },
    }),
  );
}
