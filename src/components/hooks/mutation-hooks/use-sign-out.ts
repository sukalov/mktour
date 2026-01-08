import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';

export const useSignOutMutation = (queryClient: QueryClient) => {
  const trpc = useTRPC();
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
