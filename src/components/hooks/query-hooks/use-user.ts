import { getUser } from '@/lib/auth/utils';
import { useQuery } from '@tanstack/react-query';

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: [userId, 'user', 'profile'],
    queryFn: () => getUser(),
    staleTime: Infinity,
  });
};
