import { getClubPlayers } from '@/server/actions/club-managing';
import { useQuery } from '@tanstack/react-query';

export const useClubPlayers = (id: string) => {
  return useQuery({
    queryKey: [id, 'club', 'players'],
    queryFn: () => getClubPlayers(id),
    staleTime: 1000 * 60 * 60,
  });
};
