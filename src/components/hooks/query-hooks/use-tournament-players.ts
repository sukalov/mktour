import { getTournamentPlayers } from '@/lib/actions/tournament-managing';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPlayers = (id: string) =>
  useQuery({
    queryKey: [id, 'players', 'added'],
    queryFn: () => getTournamentPlayers(id),
    staleTime: Infinity,
  });
