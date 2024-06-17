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
      queryKey: ['games', id],
      queryFn: () => getTournamentGames(id),
    }),

    queryClient.prefetchQuery({
      queryKey: ['players', id, 'players-added'],
      queryFn: () => getTournamentPlayers(id),
    }),

    queryClient.prefetchQuery({
      queryKey: ['players', id, 'players-possible'],
      queryFn: async () => await getTournamentPossiblePlayers(id),
    }),

    queryClient.prefetchQuery({
      queryKey: ['tournament', id],
      queryFn: () => getTournamentInfo(id),
    }),
  ]);
};

export { queryClient, queryPrefetch };

