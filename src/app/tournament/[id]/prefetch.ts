import { getTournamentGames, getTournamentInfo, getTournamentPlayers, getTournamentPossiblePlayers } from '@/lib/actions/tournament-managing';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5
    }
  }
});

const queryPrefetch = async (id: string) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [id, 'games'],
      queryFn: () => getTournamentGames(id),
    }),

    queryClient.prefetchQuery({
      queryKey: [id, 'players', 'players-added'],
      queryFn: () => getTournamentPlayers(id),
    }),

    queryClient.prefetchQuery({
      queryKey: [id, 'players', 'players-possible'],
      queryFn: async () => await getTournamentPossiblePlayers(id),
    }),

    queryClient.prefetchQuery({
      queryKey: [id, 'tournament'],
      queryFn: () => getTournamentInfo(id),
    }),
  ]);
};

export { queryClient, queryPrefetch };

