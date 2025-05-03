import { PlayerModel } from '@/types/tournaments';
import { useQuery } from '@tanstack/react-query';

export const useTournamentPlayers = (id: string) =>
  useQuery({
    queryKey: [id, 'players', 'added'],
    queryFn: async (): Promise<PlayerModel[]> => {
      const response = await fetch(`/api/tournament/${id}/players-in`);
      if (!response.ok) {
        throw new Error('failed to fetch tournament players');
      }
      return response.json();
    },
    staleTime: Infinity,
  });
