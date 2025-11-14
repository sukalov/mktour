import { trpc } from '@/components/trpc/server';
import { QueryClient, useMutation } from '@tanstack/react-query';

export const useSignOutMutation = (queryClient: QueryClient) => {
  return useMutation(
    trpc.auth.signOut.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.pathKey(),
        });
      },
    }),
  );
};
