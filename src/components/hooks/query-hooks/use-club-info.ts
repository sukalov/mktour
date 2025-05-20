import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useClubInfo = (clubId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.club.info.queryOptions({ clubId }));
};
