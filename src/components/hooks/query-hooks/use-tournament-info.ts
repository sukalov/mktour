import { getTournamentInfo } from '@/lib/actions/tournament-managing';
import { useQuery } from '@tanstack/react-query';

export const useTournamentInfo = (id: string) =>
  useQuery({
    queryKey: [id, 'tournament'],
    queryFn: () => getTournamentInfo(id),
    staleTime: Infinity,
  });
