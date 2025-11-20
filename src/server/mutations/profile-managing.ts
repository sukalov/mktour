'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { db } from '@/server/db';
import { clubs, clubs_to_users } from '@/server/db/schema/clubs';
import { user_notifications } from '@/server/db/schema/notifications';
import { affiliations, players } from '@/server/db/schema/players';
import {
  games,
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import { sessions, user_preferences, users } from '@/server/db/schema/users';
import { EditProfileFormType } from '@/server/db/zod/users';
import { deleteClubFunction } from '@/server/mutations/club-managing';
import { and, asc, eq, sql } from 'drizzle-orm';

export const editUser = async (values: EditProfileFormType) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  await db.update(users).set(values).where(eq(users.id, user.id));
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
    for (const clubId in notSelectedClubs) {
      await deleteClubFunction({
        userId,
        clubId: notSelectedClubs[clubId],
        userDeletion: true,
      });
    }
  }

  const clubId = user.selected_club;

  const clubsNeedingPromotion = await db
    .select({
      clubId: clubs_to_users.club_id,
    })
    .from(clubs_to_users)
    .where(
      and(
        eq(clubs_to_users.user_id, userId),
        eq(clubs_to_users.status, 'co-owner'),
      ),
    )
    .groupBy(clubs_to_users.club_id);

  const clubsToPromote: string[] = [];
  if (clubsNeedingPromotion.length > 0) {
    const clubIds = clubsNeedingPromotion.map((c) => c.clubId);

    const coOwnerCounts = await db
      .select({
        clubId: clubs_to_users.club_id,
        count: sql<number>`COUNT(*)`,
      })
      .from(clubs_to_users)
      .where(
        and(
          sql`${clubs_to_users.club_id} IN (${sql.join(
            clubIds.map((id) => sql`${id}`),
            sql`, `,
          )})`,
          eq(clubs_to_users.status, 'co-owner'),
        ),
      )
      .groupBy(clubs_to_users.club_id);

    for (const { clubId, count } of coOwnerCounts) {
      if (count === 1) {
        clubsToPromote.push(clubId);
      }
    }
  }

  if (clubsToPromote.length > 0) {
    const allAdmins = await db
      .select()
      .from(clubs_to_users)
      .where(
        and(
          sql`${clubs_to_users.club_id} IN (${sql.join(
            clubsToPromote.map((id) => sql`${id}`),
            sql`, `,
          )})`,
          eq(clubs_to_users.status, 'admin'),
        ),
      )
      .orderBy(asc(clubs_to_users.promoted_at));

    const oldestAdminsByClub = new Map<string, (typeof allAdmins)[0]>();
    for (const admin of allAdmins) {
      if (!oldestAdminsByClub.has(admin.club_id)) {
        oldestAdminsByClub.set(admin.club_id, admin);
      }
    }

    const promotionDate = new Date();
    const updatePromises = Array.from(oldestAdminsByClub.values()).map(
      (admin) =>
        db
          .update(clubs_to_users)
          .set({
            status: 'co-owner',
            promoted_at: promotionDate,
          })
          .where(eq(clubs_to_users.id, admin.id)),
    );

    await Promise.all(updatePromises);
  }

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

    await tx
      .update(players)
      .set({ user_id: null })
      .where(eq(players.user_id, userId));

    await tx
      .delete(user_notifications)
      .where(eq(user_notifications.user_id, userId));

    await tx.delete(affiliations).where(eq(affiliations.user_id, userId));

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
