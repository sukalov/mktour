import { DatabasePlayer } from '@/lib/db/schema/tournaments';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPossiblePlayers = (id: string) =>
  useQuery({
    queryKey: [id, 'players', 'possible'],
    queryFn: async (): Promise<DatabasePlayer[]> => {
      const response = await fetch(`/api/tournament/${id}/players-out`);
      if (!response.ok) {
        throw new Error('failed to fetch tournament players');
      }
      return response.json();
    },
    staleTime: Infinity,
  });
