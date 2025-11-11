import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useClubAddPlayerMutation = (queryClient: QueryClient) => {
  const trpc = useTRPC();
  return useMutation(
    trpc.club.players.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.club.players.infinite.infiniteQueryKey(),
        });
      },
      onError: () => toast.error('sorry! server error happened'),
    }),
  );
};
