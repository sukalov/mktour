import getUserClubs from '@/lib/actions/user-clubs';
import { getUser } from '@/lib/auth/utils';
import { useQuery } from '@tanstack/react-query';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 30 * 1000 * 60,
  });
};

export const useUserClubs = (id: string) => {
  return useQuery({
    queryKey: ['user', 'clubs'],
    queryFn: () => getUserClubs({ userId: id }),
    staleTime: 30 * 1000 * 60,
  });
};
