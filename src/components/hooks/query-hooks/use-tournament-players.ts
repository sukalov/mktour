import { useTRPC } from '@/components/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPlayers = (tournamentId: string) => {
  const trpc = useTRPC();
  return useQuery(trpc.tournament.playersIn.queryOptions({ tournamentId }));
};
