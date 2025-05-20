import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useClubTournaments = (clubId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.club.clubTournaments.queryOptions({ clubId }));
};
