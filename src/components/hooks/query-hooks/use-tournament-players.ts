import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPlayers = (id: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.tournament.playersIn.queryOptions(id));
};
