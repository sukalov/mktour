import { useTRPC } from '@/components/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useChangeNotificationStatusMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.auth.notifications.changeStatus.mutationOptions({
      onMutate: async ({ notificationId, seen }) => {
        queryClient.cancelQueries({
          queryKey: trpc.auth.notifications.infinite.infiniteQueryKey({}),
        });

        const prevCache = queryClient.getQueryData(
          trpc.auth.notifications.infinite.infiniteQueryKey({}),
        );

        queryClient.setQueryData(
          trpc.auth.notifications.infinite.infiniteQueryKey({}),
          (cache) => {
            if (!cache) return cache;
            const newCache = { ...cache };
            let found = false;

            for (const page of newCache.pages) {
              for (const item of page.notifications) {
                if (item.notification.id === notificationId) {
                  item.notification.isSeen = seen;
                  found = true;
                  break;
                }
              }
              if (found) break;
            }

            return newCache;
          },
        );

        return { prevCache };
      },
      onError: (_err, _variables, context) => {
        if (context?.prevCache) {
          queryClient.setQueryData(
            trpc.auth.notifications.infinite.infiniteQueryKey({}),
            context.prevCache,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.notifications.pathKey(),
        });
      },
    }),
  );
};

export const useMarkAllNotificationAsSeenMutation = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.auth.notifications.markAllAsSeen.mutationOptions({
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: trpc.auth.notifications.pathKey(),
        });

        const prevCache = queryClient.getQueryData(
          trpc.auth.notifications.infinite.infiniteQueryKey(),
        );

        queryClient.setQueryData(
          trpc.auth.notifications.infinite.infiniteQueryKey(),
          (cache) => {
            if (!cache) return cache;
            const newCache = { ...cache };

            newCache.pages.forEach((page) => {
              page.notifications.forEach((item) => {
                item.notification.isSeen = true;
              });
            });

            return newCache;
          },
        );

        return { prevCache };
      },
      onError: (_err, _variables, context) => {
        if (context?.prevCache) {
          queryClient.setQueryData(
            trpc.auth.notifications.infinite.infiniteQueryKey(),
            context.prevCache,
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.auth.notifications.pathKey(),
        });
      },
    }),
  );
};
