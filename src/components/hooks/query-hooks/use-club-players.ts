import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useClubPlayers = (clubId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.club.players.queryOptions({ clubId }));
};
