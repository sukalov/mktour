import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePlayerAddMutation = (queryClient: QueryClient) => {
  const trpc = useTRPC();
  return useMutation(
    trpc.player.create.mutationOptions({
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({
          queryKey: trpc.club.players.infinite.infiniteQueryKey({
            clubId: variables.clubId,
          }),
        });
      },
      onError: (error) =>
        toast.error('sorry! server error happened: ' + error.message),
    }),
  );
};
