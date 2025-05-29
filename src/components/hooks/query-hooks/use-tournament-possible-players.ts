import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPossiblePlayers = (tournamentId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.tournament.playersOut.queryOptions({ tournamentId }));
};
