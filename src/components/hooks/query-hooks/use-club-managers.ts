import getAllClubManagers from '@/server/mutations/club-managing';
import { useQuery } from '@tanstack/react-query';

export const useClubManagers = (id: string) => {
  return useQuery({
    queryKey: [id, 'club', 'users', 'managers'],
    queryFn: () => getAllClubManagers(id),
  });
};
