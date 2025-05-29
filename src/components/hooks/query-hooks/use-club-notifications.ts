import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useClubNotifications = (clubId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.club.notifications.queryOptions({ clubId }));
};
