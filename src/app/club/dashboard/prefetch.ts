import getUserClubs from '@/lib/actions/user-clubs';
import { getUser } from '@/lib/auth/utils';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

const clubQueryClient = new QueryClient();

const clubQueryPrefetch = async () => {
  const user = await clubQueryClient.fetchQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
  if (!user) redirect('/club/explore');

  await clubQueryClient.prefetchQuery({
    queryKey: ['user', 'clubs', 'all-user-clubs'],
    queryFn: () => getUserClubs({ userId: user.id }),
  });
};

export { clubQueryClient, clubQueryPrefetch };
