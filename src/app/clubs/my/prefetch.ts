import { getUser } from '@/lib/auth/utils';
import { getClubInfo, getClubPlayers } from '@/server/actions/club-managing';
import { getClubTournaments } from '@/server/actions/get-club-tournaments';
import getUserClubs from '@/server/actions/user-clubs';
import { QueryClient } from '@tanstack/react-query';

const clubQueryClient = new QueryClient();

const clubQueryPrefetch = async (userId: string, selectedClubId: string) => {
  await Promise.all([
    clubQueryClient.prefetchQuery({
      queryKey: [userId, 'user', 'profile'],
      queryFn: getUser,
    }),
    clubQueryClient.prefetchQuery({
      queryKey: [userId, 'user', 'clubs', 'all-user-clubs'],
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
    clubQueryClient.prefetchQuery({
      queryKey: [selectedClubId, 'club', 'tournaments'],
      queryFn: () => getClubTournaments(selectedClubId),
    }),
  ]);
};

export { clubQueryClient, clubQueryPrefetch };
