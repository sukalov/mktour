import { trpc } from '@/trpc/server';
import { QueryClient } from '@tanstack/react-query';

const tournamentQueryClient = new QueryClient();

const tournamentQueryPrefetch = async (tournamentId: string) => {
  await Promise.all([
    tournamentQueryClient.prefetchQuery(
      trpc.tournament.playersIn.queryOptions({ tournamentId }),
    ),

    tournamentQueryClient.prefetchQuery(
      trpc.tournament.playersOut.queryOptions({ tournamentId }),
    ),

    tournamentQueryClient.prefetchQuery(
      trpc.tournament.info.queryOptions({ tournamentId }),
    ),
  ]);
};

export { tournamentQueryClient, tournamentQueryPrefetch };
