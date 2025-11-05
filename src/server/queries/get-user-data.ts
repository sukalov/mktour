import { db } from '@/server/db';
import { StatusInClub } from '@/server/db/schema/clubs';
import { affiliations, AffiliationStatus } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { getUserClubIds } from '@/server/queries/get-user-clubs';
import { eq } from 'drizzle-orm';
import { User } from 'lucia';
import { cacheLife, cacheTag } from 'next/cache';

const getUserInfo = async (username: string) => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
  if (!user) throw new Error('USER_NOT_FOUND');
  return user;
};

export const getUserInfoByUsername = async (username: string) => {
  'use cache';
  cacheLife({
    stale: 1000 * 60 * 60,
    revalidate: 1000 * 60 * 60,
  });
  return await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .get();
};

type UserContext = {
  user: User;
  userClubs: {
    [club_id: string]: StatusInClub; // "admin" | "co-owner"
  };
  userAffiliations: {
    [club_id: string]: {
      player_id: string;
      status: AffiliationStatus;
    };
  };
};

const getAffiliations = async (userId: string) => {
  return (
    await db
      .select({
        club_id: affiliations.club_id,
        player_id: affiliations.player_id,
        status: affiliations.status,
      })
      .from(affiliations)
      .where(eq(affiliations.user_id, userId))
  ).reduce(
    (acc, curr) => {
      acc[curr.club_id] = curr;
      return acc;
    },
    {} as UserContext['userAffiliations'],
  );
};

export const getUserData = async (userId: string): Promise<UserContext> => {
  'use cache';
  const user = await getUserInfo(userId);
  const userClubs = await getUserClubIds({ userId });
  const userAffiliations = await getAffiliations(userId);
  cacheTag(`user-context:${userId}`);
  return {
    user,
    userClubs,
    userAffiliations,
  };
};
