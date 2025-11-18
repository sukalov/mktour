import { db } from '@/server/db';
import { club_notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { eq, sql } from 'drizzle-orm';

export default async function getClubNotifications(clubId: string) {
  return await db
    .select({
      event: club_notifications.event,
      notification: club_notifications,
      affiliation: affiliations,
      user: users,
      player: players,
    })
    .from(club_notifications)
    .where(eq(club_notifications.club_id, clubId))
    .leftJoin(
      affiliations,
      sql`json_extract(${club_notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
    )
    .leftJoin(users, eq(users.id, affiliations.user_id))
    .leftJoin(players, eq(players.id, affiliations.player_id));
}

export type ClubNotification = Awaited<
  ReturnType<typeof getClubNotifications>
>[0];
