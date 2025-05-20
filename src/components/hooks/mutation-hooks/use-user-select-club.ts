import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserSelectClub = (queryClient: QueryClient) => {
  const trpc = useTRPC();
  return useMutation(
    trpc.user.selectClub.mutationOptions({
      onMutate: ({ clubId }) => {
        queryClient.cancelQueries({ queryKey: trpc.user.userAuth.queryKey() });

        const previousState = queryClient.getQueryData(
          trpc.user.userAuth.queryKey(),
        );

        queryClient.setQueryData(
          trpc.user.userAuth.queryKey(),
          (cache) =>
            cache && {
              ...cache,
              selected_club: clubId,
            },
        );
        return { previousState };
      },

      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.user.userAuth.queryKey(),
        });
      },
      onError: (_error, _variables, context) => {
        toast.error('error happened', {
          id: 'error',
          duration: 3000,
        });
        queryClient.setQueryData(
          trpc.user.userAuth.queryKey(),
          context?.previousState,
        );
      },
    }),
  );
};
