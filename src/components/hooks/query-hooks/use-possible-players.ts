import { getTournamentPossiblePlayers } from '@/lib/actions/tournament-managing';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPossiblePlayers = (id: string) =>
  useQuery({
    queryKey: ['players', 'possible', id],
    queryFn: () => getTournamentPossiblePlayers(id),
    staleTime: Infinity,
  });
