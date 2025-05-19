import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPossiblePlayers = (id: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.tournament.playersOut.queryOptions(id));
};
