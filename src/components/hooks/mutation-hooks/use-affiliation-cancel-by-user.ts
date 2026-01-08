import { useTRPC } from '@/components/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAffiliationCancelByUserMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.player.affiliation.cancelByUser.mutationOptions({
      onSuccess: (_, { playerId }) => {
        queryClient.invalidateQueries({
          queryKey: trpc.player.info.queryKey({ playerId }),
        });
      },
    }),
  );
};
