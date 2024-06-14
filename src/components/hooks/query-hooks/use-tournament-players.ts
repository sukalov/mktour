import { getTournamentPlayers } from '@/lib/actions/tournament-managing';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPlayers = (id: string) =>
  useQuery({
    queryKey: ['players', 'added', id],
    queryFn: () => getTournamentPlayers(id),
    staleTime: Infinity
  });
