import { getClubTournaments } from '@/server/actions/get-club-tournaments';
import { useQuery } from '@tanstack/react-query';

export const useClubTournaments = (id: string) => {
  return useQuery({
    queryKey: [id, 'club', 'tournaments'],
    queryFn: () => getClubTournaments(id),
    staleTime: 1000 * 60 * 60,
  });
};
