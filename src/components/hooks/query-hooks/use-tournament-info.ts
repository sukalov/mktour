import { TournamentInfo } from '@/types/tournaments';
import { useQuery } from '@tanstack/react-query';

export const useTournamentInfo = (tournamentId: string) =>
  useQuery({
    queryKey: [tournamentId, 'tournament'],
    queryFn: async (): Promise<TournamentInfo> => {
      const response = await fetch(`/api/tournament/${tournamentId}/info`);
      if (!response.ok) {
        throw new Error('failed to fetch tournament players');
      }
      return response.json();
    },
    staleTime: Infinity,
  });
