import getUserClubs from '@/lib/actions/user-clubs';
import { useQuery } from '@tanstack/react-query';

export const useUserClubs = (id: string) => {
  return useQuery({
    queryKey: ['user', 'clubs', 'all-user-clubs'],
    queryFn: () => getUserClubs({ userId: id }),
    staleTime: 30 * 1000 * 60,
  });
};
