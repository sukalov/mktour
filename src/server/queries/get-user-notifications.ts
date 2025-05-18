import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import {
  DatabaseNotification,
  notifications,
} from '@/server/db/schema/notifications';
import {
  affiliations,
  DatabaseAffiliation,
  DatabasePlayer,
  players,
} from '@/server/db/schema/players';
import { DatabaseUser, users } from '@/server/db/schema/users';
import { getUserClubNames } from '@/server/queries/get-user-clubs';
import { eq, inArray, sql } from 'drizzle-orm';

const getUserNotifications = async (): Promise<AffiliationNotification[]> => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('UNAUTHORIZED_REQUEST');
  }

  const userClubs = await getUserClubNames({ userId: user.id });

  return await db
    .select({
      affiliation: affiliations,
      notification: notifications,
      player: { nickname: players.nickname, id: players.id },
      clubName: clubs.name,
      user: users,
    })
    .from(notifications)
    .where(
      inArray(
        notifications.club_id,
        userClubs.map((club) => club.id),
      ),
    )
    .leftJoin(
      affiliations,
      sql`json_extract(${notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
    )
    .innerJoin(users, eq(users.id, affiliations.user_id))
    .innerJoin(players, eq(players.id, affiliations.player_id))
    .innerJoin(clubs, eq(clubs.id, notifications.club_id));
};

export type AffiliationNotification = {
  affiliation: DatabaseAffiliation | null;
  notification: DatabaseNotification;
  player: Pick<DatabasePlayer, 'nickname' | 'id'> | null;
  clubName?: DatabaseClub['name'] | null;
  user?: DatabaseUser | null;
};

export default getUserNotifications;
