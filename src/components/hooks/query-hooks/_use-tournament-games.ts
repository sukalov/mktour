import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

export const useTournamentGames = (id: string) => {
  const trpc = useTRPC();
  useQuery(trpc.tournament.allGames.queryOptions(id));
};
