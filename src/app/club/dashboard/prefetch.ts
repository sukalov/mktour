import { getClubInfo } from '@/lib/actions/club-managing';
import getUserClubs from '@/lib/actions/user-clubs';
import { getUser } from '@/lib/auth/utils';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

const clubQueryClient = new QueryClient();

const clubQueryPrefetch = async () => {
  const user = await clubQueryClient.fetchQuery({
    queryKey: ['user', 'profile'],
    queryFn: getUser,
  });
  if (!user) redirect('/club/explore');

  await Promise.all([
    clubQueryClient.prefetchQuery({
      queryKey: ['user', 'clubs', 'all-user-clubs'],
      queryFn: () => getUserClubs({ userId: user.id }),
    }),
    clubQueryClient.prefetchQuery({
      queryKey: [user.selected_club, 'club-info'],
      queryFn: () => getClubInfo(user.selected_club),
    }),
  ]);
};

export { clubQueryClient, clubQueryPrefetch };
