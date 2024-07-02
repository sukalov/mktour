import { getClubInfo, getClubPlayers } from '@/lib/actions/club-managing';
import getUserClubs from '@/lib/actions/user-clubs';
import { getUser } from '@/lib/auth/utils';
import { QueryClient } from '@tanstack/react-query';

const clubQueryClient = new QueryClient();

const clubQueryPrefetch = async (userId: string, selectedClubId: string) => {
  await Promise.all([
    clubQueryClient.prefetchQuery({
      queryKey: [userId, 'user', 'profile'],
      queryFn: getUser,
    }),
    clubQueryClient.prefetchQuery({
      queryKey: [, userId, 'user', 'clubs', 'all-user-clubs'],
      queryFn: () => getUserClubs({ userId }),
    }),
    clubQueryClient.prefetchQuery({
      queryKey: [selectedClubId, 'club', 'info'],
      queryFn: () => getClubInfo(selectedClubId),
    }),
    clubQueryClient.prefetchQuery({
      queryKey: [selectedClubId, 'club', 'players'],
      queryFn: () => getClubPlayers(selectedClubId),
    }),
  ]);
};

export { clubQueryClient, clubQueryPrefetch };
