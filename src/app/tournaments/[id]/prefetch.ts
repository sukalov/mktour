import { trpc } from '@/trpc/server';
import { QueryClient } from '@tanstack/react-query';

const tournamentQueryClient = new QueryClient();

const tournamentQueryPrefetch = async (id: string) => {
  await Promise.all([
    tournamentQueryClient.prefetchQuery(
      trpc.tournament.playersIn.queryOptions(id),
    ),

    tournamentQueryClient.prefetchQuery(
      trpc.tournament.playersOut.queryOptions(id),
    ),

    tournamentQueryClient.prefetchQuery(trpc.tournament.info.queryOptions(id)),
  ]);
};

export { tournamentQueryClient, tournamentQueryPrefetch };
