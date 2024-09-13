import getUserClubs from '@/lib/actions/user-clubs';
import { useQuery } from '@tanstack/react-query';

export const useUserClubs = (userId: string) => {
  return useQuery({
    queryKey: [userId, 'user', 'clubs', 'all-user-clubs'],
    queryFn: () => getUserClubs({ userId }),
    staleTime: 30 * 1000 * 60,
  });
};
