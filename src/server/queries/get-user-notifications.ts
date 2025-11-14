import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import {
  DatabaseUserNotification,
  user_notifications,
} from '@/server/db/schema/notifications';
import {
  affiliations,
  DatabaseAffiliation,
  DatabasePlayer,
  players,
} from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { and, desc, eq, or, sql } from 'drizzle-orm';

export const getNotificationsCounter = async () => {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('UNAUTHORIZED_REQUEST');
  }
  return (
    await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(user_notifications)
      .orderBy(desc(user_notifications.created_at))
      .where(
        and(
          eq(user_notifications.user_id, user.id),
          eq(user_notifications.is_seen, false),
        ),
      )
  ).at(0)?.count;
};

export const getUserNotificationsInfinite = async ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('UNAUTHORIZED_REQUEST');
  }

  const result = (await db
    .select({
      type: user_notifications.notification_type,
      affiliation: affiliations,
      notification: user_notifications,
      metadata: user_notifications.metadata,
      player: { nickname: players.nickname, id: players.id },
      club: clubs,
    })
    .from(user_notifications)
    .where(eq(user_notifications.user_id, user.id))
    .leftJoin(
      affiliations,
      sql`json_extract(${user_notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
    )
    .leftJoin(users, eq(users.id, affiliations.user_id))
    .leftJoin(players, eq(players.id, affiliations.player_id))
    .leftJoin(
      clubs,
      or(
        eq(clubs.id, affiliations.club_id),
        eq(
          clubs.id,
          sql`json_extract(${user_notifications.metadata}, '$.club_id')`,
        ),
      ),
    )
    .orderBy(desc(user_notifications.created_at))
    .limit(limit + 1)
    .offset(offset)) as UserNotification[]; // FIXME (some day we will write good type-safe code)

  let nextCursor: number | null = null;
  if (result.length > limit) {
    nextCursor = offset + limit;
  }
  return {
    notifications: result.slice(0, limit),
    nextCursor,
  };
};
export type UserNotification =
  | {
      type: 'affiliation_approved';
      notification: DatabaseUserNotification;
      affiliation: DatabaseAffiliation;
      player: Pick<DatabasePlayer, 'nickname' | 'id'>;
      club: DatabaseClub;
      metadata: {
        club_id: string;
        affiliation_id: string;
      };
    }
  | {
      type: 'affiliation_rejected';
      notification: DatabaseUserNotification;
      affiliation: DatabaseAffiliation;
      player: Pick<DatabasePlayer, 'nickname' | 'id'>;
      club: DatabaseClub;
      metadata: {
        club_id: string;
        affiliation_id: string;
      };
    }
  | {
      type: 'became_club_manager';
      notification: DatabaseUserNotification;
      club: DatabaseClub;
      role: 'co-owner' | 'admin';
      metadata: {
        club_id: string;
        role: 'co-owner' | 'admin';
      };
    }
  | {
      type: 'tournament_won';
      notification: DatabaseUserNotification;
      metadata: {
        name: string;
        tournament_id: string;
      };
    };
