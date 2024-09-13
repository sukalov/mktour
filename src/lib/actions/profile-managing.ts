'use server';

import { deleteClubFunction } from '@/lib/actions/club-managing';
import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/lib/db';
import {
  DatabaseUser,
  sessions,
  user_preferences,
  users,
} from '@/lib/db/schema/auth';
import {
  clubs,
  clubs_to_users,
  games,
  players,
  players_to_tournaments,
  tournaments,
} from '@/lib/db/schema/tournaments';
import { eq, sql } from 'drizzle-orm';

export const editUser = async ({ id, values }: UpdateDatabaseUser) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== id) throw new Error('USER_NOT_MATCHING');
  await db.update(users).set(values).where(eq(users.id, id));
};

export const deleteUser = async ({ userId }: { userId: string }) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');

  const subqueryToFilterMultipleAdmins = db
    .select({
      clubId: clubs_to_users.club_id,
    })
    .from(clubs_to_users)
    .groupBy(clubs_to_users.club_id)
    .having(sql`COUNT(${clubs_to_users.user_id}) = 1`);

  const userClubs = (
    await db
      .select({
        clubId: clubs_to_users.club_id,
      })
      .from(clubs_to_users)
      .where(
        sql`${clubs_to_users.club_id} IN (${subqueryToFilterMultipleAdmins}) AND ${clubs_to_users.user_id} = ${userId}`,
      )
  ).map((el) => el.clubId);

  let notSelectedClubs: string[] = [];
  if (userClubs.length !== 0) {
    notSelectedClubs = userClubs.filter(
      (clubId) => clubId !== user.selected_club,
    );
  }

  if (notSelectedClubs.length !== 0) {
    for (let clubId in notSelectedClubs) {
      await deleteClubFunction({
        userId,
        id: notSelectedClubs[clubId],
        userDeletion: true,
      });
    }
  }

  const clubId = user.selected_club;

  await db.transaction(async (tx) => {
    if (userClubs.includes(clubId)) {
      await tx
        .delete(games)
        .where(
          eq(
            games.tournament_id,
            tx
              .select({ id: tournaments.id })
              .from(tournaments)
              .where(eq(tournaments.club_id, clubId)),
          ),
        );
      await tx
        .delete(players_to_tournaments)
        .where(
          eq(
            players_to_tournaments.tournament_id,
            tx
              .select({ id: tournaments.id })
              .from(tournaments)
              .where(eq(tournaments.club_id, clubId)),
          ),
        );
      await tx.delete(players).where(eq(players.club_id, clubId));
      await tx.delete(tournaments).where(eq(tournaments.club_id, clubId));
    }
    await tx.delete(clubs_to_users).where(eq(clubs_to_users.user_id, userId));
    await tx
      .delete(user_preferences)
      .where(eq(user_preferences.user_id, userId));
    await tx.delete(sessions).where(eq(sessions.userId, userId));
    await tx.delete(users).where(eq(users.id, userId));
    if (userClubs.includes(clubId))
      await tx.delete(clubs).where(eq(clubs.id, clubId));
  });
};

type UpdateDatabaseUser = {
  id: string;
  values: Partial<DatabaseUser>;
};
