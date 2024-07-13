import { getClubTournaments } from '@/lib/actions/get-club-tournaments';
import { useQuery } from '@tanstack/react-query';

export const useClubTournaments = (id: string, isInView?: boolean) => {
  return useQuery({
    queryKey: [id, 'club', 'tournaments'],
    queryFn: () => getClubTournaments(id),
    staleTime: 1000 * 60 * 60,
    enabled: isInView || true
  });
};
