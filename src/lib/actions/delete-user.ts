import { deleteClubFunction } from '@/lib/actions/club-managing';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/auth';
import { clubs_to_users } from '@/lib/db/schema/tournaments';
import { eq, sql } from 'drizzle-orm';

export const deleteUser = async ({ userId }: { userId: string }) => {
  //   const { user } = await validateRequest();
  // if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  // if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  const user = (await db.select().from(users).where(eq(users.id, userId))).at(
    0,
  );
  console.log(user);

  const subqueryToFilterMultipleAdmins = db
    .select({
      clubId: clubs_to_users.club_id,
    })
    .from(clubs_to_users)
    .groupBy(clubs_to_users.club_id)
    .having(sql`COUNT(${clubs_to_users.user_id}) = 1`);

  const userClubs = await db
    .select({
      clubId: clubs_to_users.club_id,
    })
    .from(clubs_to_users)
    .where(
      sql`${clubs_to_users.club_id} IN (${subqueryToFilterMultipleAdmins}) AND ${clubs_to_users.user_id} = ${userId}`,
    );

  const notSelectedClubs = userClubs.filter(
    (club) => club.clubId !== user!.selected_club,
  );

  for (let club in notSelectedClubs) {
    await deleteClubFunction({
      userId,
      id: notSelectedClubs[club].clubId,
      userDeletion: true,
    });
  }
};

deleteUser({ userId: 'dhhg3ART' });
