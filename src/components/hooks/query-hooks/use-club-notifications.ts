import { useTRPC } from '@/components/trpc/client';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useClubNotifications = (clubId: string) => {
  const trpc = useTRPC();
  return useInfiniteQuery(
    trpc.club.notifications.infiniteQueryOptions(
      {
        clubId,
        cursor: undefined,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
};
