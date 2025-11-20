import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { clubs, DatabaseClub } from '@/server/db/schema/clubs';
import { user_notifications } from '@/server/db/schema/notifications';
import {
  affiliations,
  DatabaseAffiliation,
  DatabasePlayer,
  players,
} from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { UserNotificationEvent } from '@/server/db/zod/enums';
import {
  UserNotification,
  UserNotificationMetadata,
} from '@/types/notifications';
import { and, desc, eq, or, sql } from 'drizzle-orm';

export const getNotificationsCounter = async (userId: string) => {
  return (
    (
      await db
        .select({
          count: sql<number>`COUNT(*)`,
        })
        .from(user_notifications)
        .orderBy(desc(user_notifications.createdAt))
        .where(
          and(
            eq(user_notifications.userId, userId),
            eq(user_notifications.isSeen, false),
          ),
        )
    ).at(0)?.count ?? 0
  );
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

  const result = await db
    .select({
      event: user_notifications.event,
      affiliation: affiliations,
      notification: user_notifications,
      metadata: user_notifications.metadata,
      player: { nickname: players.nickname, id: players.id },
      club: clubs,
    })
    .from(user_notifications)
    .where(eq(user_notifications.userId, user.id))
    .leftJoin(
      affiliations,
      sql`json_extract(${user_notifications.metadata}, '$.affiliationId') = ${affiliations.id}`,
    )
    .leftJoin(users, eq(users.id, affiliations.userId))
    .leftJoin(players, eq(players.id, affiliations.playerId))
    .leftJoin(
      clubs,
      or(
        eq(clubs.id, affiliations.clubId),
        eq(
          clubs.id,
          sql`json_extract(${user_notifications.metadata}, '$.clubId')`,
        ),
      ),
    )
    .orderBy(desc(user_notifications.createdAt))
    .limit(limit + 1)
    .offset(offset);

  let nextCursor: number | null = null;
  if (result.length > limit) {
    nextCursor = offset + limit;
  }
  return {
    notifications: result.slice(0, limit),
    nextCursor,
  };
};

export type UserNotificationExtendedInfer = Awaited<
  ReturnType<typeof getUserNotificationsInfinite>
>['notifications'][0];

export type UserNotificationExtended<T extends UserNotificationEvent> = {
  event: T;
  notification: UserNotification<T>;
  metadata: UserNotificationMetadata[T];
  affiliation: DatabaseAffiliation | null;
  player: Pick<DatabasePlayer, 'id' | 'nickname'> | null;
  club: DatabaseClub | null;
};

export type AnyUserNotificationExtended = {
  [K in UserNotificationEvent]: UserNotificationExtended<K>;
}[UserNotificationEvent];
