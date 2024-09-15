import { getTournamentGames } from '@/lib/actions/tournament-managing';
import { useQuery } from '@tanstack/react-query';

export const useTournamentGames = (id: string) =>
  useQuery({
    queryKey: [id, 'games'],
    queryFn: () => getTournamentGames(id),
    staleTime: Infinity,
  });