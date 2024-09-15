import { getTournamentRoundGames } from '@/lib/actions/tournament-managing';
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
    queryFn: () => getTournamentRoundGames({ tournamentId, roundNumber }),
    staleTime: Infinity,
  });
