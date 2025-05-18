import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema/notifications';
import { affiliations, players } from '@/lib/db/schema/players';
import { users } from '@/lib/db/schema/users';
import { eq, sql } from 'drizzle-orm';

const getUserNotifications = async () => {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error('UNAUTHORIZED_REQUEST');
  }

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.user_id, user.id))
    .leftJoin(
      affiliations,
      sql`json_extract(${notifications.metadata}, '$.affiliation_id') = ${affiliations.id}`,
    )
    .leftJoin(users, eq(users.id, affiliations.user_id))
    .leftJoin(players, eq(players.id, affiliations.player_id));
};

export default getUserNotifications;
