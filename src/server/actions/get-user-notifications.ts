import { validateRequest } from '@/lib/auth/lucia';
import getUserClubs from '@/server/actions/user-clubs';
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
import { eq, inArray, sql } from 'drizzle-orm';

const getUserNotifications = async (): Promise<AffiliationNotification[]> => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('UNAUTHORIZED_REQUEST');
  }

  const userClubs = await getUserClubs({ userId: user.id });

  return await db
    .select()
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
    .leftJoin(users, eq(users.id, affiliations.user_id))
    .leftJoin(players, eq(players.id, affiliations.player_id))
    .leftJoin(clubs, eq(clubs.id, notifications.club_id));
};

export type AffiliationNotification = {
  affiliation: DatabaseAffiliation | null;
  notification: DatabaseNotification;
  user: DatabaseUser | null;
  player: DatabasePlayer | null;
  club?: DatabaseClub | null;
};

export default getUserNotifications;
