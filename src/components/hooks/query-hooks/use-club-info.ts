import { getClubInfo } from '@/server/actions/club-managing';
import { useQuery } from '@tanstack/react-query';

export const useClubInfo = (id: string) => {
  return useQuery({
    queryKey: [id, 'club', 'info'],
    queryFn: () => getClubInfo(id),
    staleTime: 1000 * 60 * 60,
  });
};
