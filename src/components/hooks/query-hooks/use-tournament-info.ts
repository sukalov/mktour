import { getTournamentInfo } from '@/lib/actions/tournament-managing';
import { useQuery } from '@tanstack/react-query';

export const useTournamentInfo = (tournamentId: string) =>
  useQuery({
    queryKey: [tournamentId, 'tournament'],
    queryFn: () => getTournamentInfo(tournamentId),
    staleTime: Infinity,
  });
