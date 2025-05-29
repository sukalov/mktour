import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useClubManagers = (id: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.club.managers.all.queryOptions({ clubId: id }));
};
