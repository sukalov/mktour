import { prefetch, trpc } from '@/components/trpc/server';

const clubQueryPrefetch = (selectedClubId: string) => {
  prefetch(trpc.auth.info.queryOptions());
  prefetch(trpc.auth.clubs.queryOptions());
  prefetch(trpc.club.info.queryOptions({ clubId: selectedClubId }));
  prefetch(
    trpc.club.players.queryOptions({
      clubId: selectedClubId,
    }),
  );
  prefetch(
    trpc.club.tournaments.queryOptions({
      clubId: selectedClubId,
    }),
  );
};

export { clubQueryPrefetch };
