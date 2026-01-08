import { prefetch, trpc } from '@/components/trpc/server';

const clubQueryPrefetch = (clubId: string) => {
  prefetch(trpc.auth.info.queryOptions());
  prefetch(trpc.auth.clubs.queryOptions());
  prefetch(trpc.club.info.queryOptions({ clubId }));
  prefetch(
    trpc.club.players.infiniteQueryOptions({
      clubId,
    }),
  );
  prefetch(
    trpc.club.tournaments.queryOptions({
      clubId,
    }),
  );
};

export { clubQueryPrefetch };
