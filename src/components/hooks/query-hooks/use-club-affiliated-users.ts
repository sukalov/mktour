import { DatabasePlayer } from '@/lib/db/schema/players';
import { DatabaseUser } from '@/lib/db/schema/users';
import { useQuery } from '@tanstack/react-query';

export const useClubAffiliatedUsers = (clubId: string) =>
  useQuery({
    queryKey: [clubId, 'club', 'users', 'affiliated'],
    queryFn: async (): Promise<Array<DatabaseUser>> => {
      const response = await fetch(`/api/club/users-affiliated`);
      if (!response.ok) {
        throw new Error('failed to fetch tournament players');
      }
      const body: Array<{ player: DatabasePlayer; user: DatabaseUser }> =
        await response.json();
      return body.map((el) => el.user);
    },
    staleTime: Infinity,
  });
