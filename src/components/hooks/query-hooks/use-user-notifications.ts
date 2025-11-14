import { useTRPC } from '@/components/trpc/client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const useUserNotifications = () => {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.auth.notifications.infinite.infiniteQueryOptions(
      {
        limit: 20,
        cursor: undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
};

export const useUserNotificationsCounter = () => {
  const trpc = useTRPC();
  return useQuery(trpc.auth.notifications.counter.queryOptions());
};
