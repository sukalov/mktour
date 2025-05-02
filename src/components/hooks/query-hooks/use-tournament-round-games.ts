import { GameModel } from '@/types/tournaments';
import { useQuery } from '@tanstack/react-query';

export const useTournamentRoundGames = ({
  tournamentId,
  roundNumber,
}: {
  tournamentId: string;
  roundNumber: number;
}) =>
  useQuery({
    queryKey: [tournamentId, 'games', { roundNumber }],
    queryFn: async (): Promise<GameModel[]> => {
      const response = await fetch(
        `/api/tournament/${tournamentId}/round/${roundNumber}`,
      );
      if (!response.ok) {
        throw new Error(`failed to fetch round-${roundNumber} games`);
      }
      return response.json();
    },
    staleTime: Infinity,
  });
