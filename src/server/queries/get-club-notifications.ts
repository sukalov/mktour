import { db } from '@/server/db';
import { notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { and, eq, sql } from 'drizzle-orm';

export default async function getClubNotifications(clubId: string) {
  return await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.club_id, clubId),
        eq(notifications.for_whom, 'club'),
      ),
    )
    .leftJoin(
      affiliations,
      sql`json_extract(${notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
    )
    .leftJoin(users, eq(users.id, affiliations.user_id))
    .leftJoin(players, eq(players.id, affiliations.player_id));
}
