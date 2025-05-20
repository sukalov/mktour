import { DatabaseClub } from '@/server/db/schema/clubs';
import { DatabasePlayer } from '@/server/db/schema/players';
import { DatabaseTournament } from '@/server/db/schema/tournaments';
import { DatabaseUser } from '@/server/db/schema/users';
import { useQuery } from '@tanstack/react-query';

export const useSearchQuery = <
  T extends 'users' | 'clubs' | 'players' | 'tournaments' | undefined,
>({
  userId,
  query,
  filter,
}: {
  userId: string | undefined;
  query: string;
  filter?: T;
}) =>
  useQuery({
    queryKey: [userId, 'search', { filter, query }],
    staleTime: 1000 * 60 * 60,
    queryFn: async (): SearchResult<T> => {
      const response = await fetch(`/api/search?q=${query}&filter=${filter}`);
      if (!response.ok) {
        throw new Error(`failed to find query`);
      }
      return response.json();
    },
  });

type EntityMap = {
  users: DatabaseUser[];
  clubs: DatabaseClub[];
  players: DatabasePlayer[];
  tournaments: DatabaseTournament[];
};

type FilterResponse<T extends keyof EntityMap | undefined> = T extends 'users'
  ? { users: EntityMap['users'] }
  : T extends 'clubs'
    ? { clubs: EntityMap['clubs'] }
    : T extends 'players'
      ? { players: EntityMap['players'] }
      : T extends 'tournaments'
        ? { tournaments: EntityMap['tournaments'] }
        : EntityMap;

type SearchResult<T extends keyof EntityMap | undefined> = Promise<
  FilterResponse<T>
>;
