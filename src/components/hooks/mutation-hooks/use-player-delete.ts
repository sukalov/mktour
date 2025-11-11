import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

// FIXME
export default function useDeletePlayerMutation(queryClient: QueryClient) {
  const trpc = useTRPC();
  const t = useTranslations('Toasts');
  return useMutation(
    trpc.player.delete.mutationOptions({
      onSuccess: (_error, { clubId }) => {
        toast.success(t('player deleted'));
        queryClient.invalidateQueries({
          queryKey: trpc.club.players.infinite.queryKey({ clubId }),
        });
      },
      onError: (error) =>
        error.message === 'PLAYER_HAS_TOURNAMENTS'
          ? toast.error(t('player has tournaments'))
          : toast.error('sorry! server error happened: ' + error.message),
    }),
  );
}
