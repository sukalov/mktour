import { prefetch, trpc } from '@/components/trpc/server';

const clubQueryPrefetch = (selectedClubId: string) => {
  prefetch(trpc.user.auth.queryOptions());
  prefetch(trpc.user.authClubs.queryOptions());
  prefetch(trpc.club.info.queryOptions({ clubId: selectedClubId }));
  prefetch(
    trpc.club.players.infinite.queryOptions({
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
