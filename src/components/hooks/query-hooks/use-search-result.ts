import { DatabaseUser } from '@/lib/db/schema/auth';
import {
  DatabaseClub,
  DatabasePlayer,
  DatabaseTournament,
} from '@/lib/db/schema/tournaments';
import { useQuery } from '@tanstack/react-query';

export const useSearchQuery = ({
  userId,
  query,
}: {
  userId: string | undefined;
  query: string;
}) =>
  useQuery({
    queryKey: [userId, 'search', { query }],
    staleTime: 1000 * 60 * 60,
    queryFn: async (): Promise<{
      users: DatabaseUser[];
      players: DatabasePlayer[];
      tournaments: DatabaseTournament[];
      clubs: DatabaseClub[];
    }> => {
      const response = await fetch(`/api/search?q=${query}`);
      if (!response.ok) {
        throw new Error(`failed to find query`);
      }
      return response.json();
    },
  });
