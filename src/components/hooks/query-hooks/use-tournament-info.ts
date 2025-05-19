import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentInfo = (tournamentId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.tournament.info.queryOptions({ tournamentId }));
};
