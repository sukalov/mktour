import { useTRPC } from '@/components/trpc/client';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUserSelectClub = (queryClient: QueryClient) => {
  const trpc = useTRPC();
  return useMutation(
    trpc.user.selectClub.mutationOptions({
      onMutate: ({ clubId }) => {
        queryClient.cancelQueries({ queryKey: trpc.auth.pathKey() });

        const previousState = queryClient.getQueryData(
          trpc.auth.info.queryKey(),
        );

        queryClient.setQueryData(
          trpc.auth.info.queryKey(),
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
          queryKey: trpc.auth.info.queryKey(),
        });
      },
      onError: (_error, _variables, context) => {
        toast.error('error happened', {
          id: 'error',
          duration: 3000,
        });
        console.log(context);
        queryClient.setQueryData(
          trpc.auth.info.queryKey(),
          context?.previousState,
        );
      },
    }),
  );
};
