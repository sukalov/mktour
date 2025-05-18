import getUserClubs from '@/lib/actions/user-clubs';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { clubs, DatabaseClub } from '@/lib/db/schema/clubs';
import {
  DatabaseNotification,
  notifications,
} from '@/lib/db/schema/notifications';
import {
  affiliations,
  DatabaseAffiliation,
  DatabasePlayer,
  players,
} from '@/lib/db/schema/players';
import { DatabaseUser, users } from '@/lib/db/schema/users';
import { eq, inArray, sql } from 'drizzle-orm';

const getUserNotifications = async (): Promise<AffiliationNotification[]> => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('UNAUTHORIZED_REQUEST');
  }

  const userClubs = await getUserClubs({ userId: user.id });

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
