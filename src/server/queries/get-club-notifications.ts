import { db } from '@/server/db';
import { club_notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { eq, getTableColumns, sql } from 'drizzle-orm';

export default async function getClubNotifications(clubId: string) {
  return await db
    .select({
      ...getTableColumns(club_notifications),
      affiliation: affiliations,
      user: users,
      player: players,
    })
    .from(club_notifications)
    .where(eq(club_notifications.clubId, clubId))
    .leftJoin(
      affiliations,
      sql`json_extract(${club_notifications.metadata}, '$.affiliationId') = ${affiliations.id}`,
    )
    .leftJoin(users, eq(users.id, affiliations.userId))
    .leftJoin(players, eq(players.id, affiliations.playerId));
}
