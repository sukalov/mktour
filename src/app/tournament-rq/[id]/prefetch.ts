import {
  getTournamentGames,
  getTournamentInfo,
  getTournamentPlayers,
  getTournamentPossiblePlayers,
} from '@/lib/actions/tournament-managing';
import { QueryClient } from '@tanstack/react-query';

const tournamentQueryClient = new QueryClient();

const tournamentQueryPrefetch = async (id: string) => {
  await Promise.all([
    tournamentQueryClient.prefetchQuery({
      queryKey: [id, 'games'],
      queryFn: () => getTournamentGames(id),
    }),

    tournamentQueryClient.prefetchQuery({
      queryKey: [id, 'players', 'added'],
      queryFn: () => getTournamentPlayers(id),
    }),

    tournamentQueryClient.prefetchQuery({
      queryKey: [id, 'players', 'possible'],
      queryFn: async () => await getTournamentPossiblePlayers(id),
    }),

    tournamentQueryClient.prefetchQuery({
      queryKey: [id, 'tournament'],
      queryFn: () => getTournamentInfo(id),
    }),
  ]);
};

export { tournamentQueryClient, tournamentQueryPrefetch };

