import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useClubAffiliatedUsers = (clubId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.club.affiliatedUsers.queryOptions({ clubId }));
};
