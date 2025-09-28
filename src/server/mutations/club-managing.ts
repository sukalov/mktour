'use server';

import { validateRequest } from '@/lib/auth/lucia';
import { newid } from '@/lib/utils';
import { NewClubFormType } from '@/lib/zod/new-club-form';
import { db } from '@/server/db';
import {
  clubs,
  clubs_to_users,
  DatabaseClub,
  DatabaseClubsToUsers,
} from '@/server/db/schema/clubs';
import {
  club_notifications,
  InsertDatabaseUserNotification,
  user_notifications,
} from '@/server/db/schema/notifications';
import {
  affiliations,
  DatabasePlayer,
  players,
} from '@/server/db/schema/players';
import {
  games,
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import { DatabaseUser, users } from '@/server/db/schema/users';
import getStatusInClub from '@/server/queries/get-status-in-club';
import { and, eq, gt, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export const createClub = async (values: NewClubFormType) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const id = newid();
  const newClub = {
    ...values,
    id,
  };
  const newRelation: DatabaseClubsToUsers = {
    id: `${user.id}=${id}`,
    club_id: id,
    user_id: user.id,
    status: 'co-owner',
  };
  try {
    await db.insert(clubs).values(newClub);
    await db.insert(clubs_to_users).values(newRelation);
    await db
      .update(users)
      .set({ selected_club: id })
      .where(eq(users.id, user.id));
  } catch (e) {
    throw new Error(`CLUB_NOT_CREATED: ${e}`);
  }
};

export const getClubInfo = async (id: DatabaseClub['id']) => {
  const data = (await db.select().from(clubs).where(eq(clubs.id, id)))?.at(0);
  if (!data) return undefined;
  return data;
};

export const getClubPlayers = async (
  clubId: DatabasePlayer['club_id'],
  limit: number,
  cursor?: string | null,
): Promise<{ players: DatabasePlayer[]; nextCursor: string | null }> => {
  const conditions = [eq(players.club_id, clubId)];
  if (cursor) {
    conditions.push(gt(players.id, cursor));
  }
  const result = await db
    .select()
    .from(players)
    .where(and(...conditions))
    .orderBy(players.id, players.nickname)
    .limit(limit + 1);

  let nextCursor: string | null = null;
  if (result.length > limit) {
    const next = result.at(-1); // remove the extra item
    nextCursor = next ? next.id : null;
  }

  return {
    players: result,
    nextCursor,
  };
};

export const editClub = async ({ clubId, userId, values }: ClubEditProps) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');
  await db.update(clubs).set(values).where(eq(clubs.id, clubId));
};

type ClubEditProps = {
  clubId: string;
  userId: string;
  values: Partial<DatabaseClub>;
};

type ClubDeleteProps = {
  clubId: string;
  userId: string;
  userDeletion: boolean;
};

export const deleteClub = async ({
  clubId,
  userId,
  userDeletion = false,
}: ClubDeleteProps) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  if (user.id !== userId) throw new Error('USER_NOT_MATCHING');
  await deleteClubFunction({ clubId, userId, userDeletion });
};

// FIXME
export const deletePlayer = async ({
  playerId,
  clubId,
}: {
  playerId: string;
  clubId: string;
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const [playerClub] = await db
    .select({ club_id: players.club_id })
    .from(players)
    .where(eq(players.id, playerId));
  if (playerClub.club_id !== clubId) throw new Error('CLUB_ID_NOT_MATCHING');
  const status = await getStatusInClub({
    userId: user.id,
    clubId: playerClub.club_id,
  });
  if (!status) throw new Error('NOT_ADMIN');
  const [playerTournament] = await db
    .select({ tournament_id: players_to_tournaments.tournament_id })
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.player_id, playerId))
    .limit(1);

  if (playerTournament) {
    throw new Error('PLAYER_HAS_TOURNAMENTS');
  }

  await db.transaction(async (tx) => {
    await tx.delete(players).where(eq(players.id, playerId));
  });
};

export const editPlayer = async ({
  clubId,
  values,
}: {
  clubId: string;
  values: Pick<DatabasePlayer, 'id' | 'nickname' | 'realname' | 'rating'>;
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const [playerClub] = await db
    .select({ club_id: players.club_id })
    .from(players)
    .where(eq(players.id, values.id));
  if (playerClub.club_id !== clubId) throw new Error('CLUB_ID_NOT_MATCHING');
  const status = await getStatusInClub({
    userId: user.id,
    clubId: playerClub.club_id,
  });
  if (!status) throw new Error('NOT_ADMIN');
  await db.update(players).set(values).where(eq(players.id, values.id));
  revalidatePath(`/player/${values.id}`);
};

export default async function getAllClubManagers(
  club_id: string,
): Promise<ClubManager[]> {
  return await db
    .select()
    .from(clubs_to_users)
    .where(eq(clubs_to_users.club_id, club_id))
    .innerJoin(users, eq(clubs_to_users.user_id, users.id));
}

export type ClubManager = {
  clubs_to_users: DatabaseClubsToUsers;
  user: DatabaseUser;
};

export const deleteClubFunction = async ({
  clubId,
  userId,
  userDeletion = false, // true when function is invoked while deleting the user - single owner of a club
}: ClubDeleteProps) => {
  const otherClubs = await db
    .select()
    .from(clubs_to_users)
    .where(
      and(
        eq(clubs_to_users.user_id, userId),
        ne(clubs_to_users.club_id, clubId),
        eq(clubs_to_users.status, 'co-owner'),
      ),
    )
    .limit(1);

  const userStatus = await getStatusInClub({ userId, clubId });
  if (userStatus !== 'co-owner') throw new Error('UNAUTHORIZED');

  if (otherClubs.length === 0 && !userDeletion) throw new Error('ZERO_CLUBS');
  if (!userDeletion) {
    await db
      .update(users)
      .set({ selected_club: otherClubs[0].club_id })
      .where(eq(users.id, userId));
  }
  await db.batch([
    db
      .delete(games)
      .where(
        eq(
          games.tournament_id,
          db
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.club_id, clubId)),
        ),
      ),
    db
      .delete(players_to_tournaments)
      .where(
        eq(
          players_to_tournaments.tournament_id,
          db
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.club_id, clubId)),
        ),
      ),

    db.delete(affiliations).where(eq(affiliations.club_id, clubId)),
    db.delete(club_notifications).where(eq(club_notifications.club_id, clubId)),
    db.delete(players).where(eq(players.club_id, clubId)),
    db.delete(tournaments).where(eq(tournaments.club_id, clubId)),
    db.delete(clubs_to_users).where(eq(clubs_to_users.club_id, clubId)),

    db.delete(clubs).where(eq(clubs.id, clubId)),
  ]);
};

export const getClubAffiliatedUsers = async (clubId: string) => {
  return (
    await db
      .select()
      .from(players)
      .where(eq(players.club_id, clubId))
      .innerJoin(users, eq(players.user_id, users.id))
  ).map((el) => el.user);
};

export const addClubManager = async ({
  clubId,
  userId,
  status,
}: {
  clubId: string;
  userId: string;
  status: 'co-owner' | 'admin';
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const authorStatus = await getStatusInClub({
    userId: user.id,
    clubId,
  });
  if (authorStatus === 'admin' && status === 'co-owner')
    throw new Error('NOT_AUTHORIZED');
  const existingRelation = await db
    .select()
    .from(clubs_to_users)
    .where(
      and(
        eq(clubs_to_users.club_id, clubId),
        eq(clubs_to_users.user_id, userId),
      ),
    );
  if (existingRelation.length > 0) throw new Error('RELATION_EXISTS');
  const newRelation: DatabaseClubsToUsers = {
    id: `${clubId}=${userId}`,
    club_id: clubId,
    user_id: userId,
    status,
  };

  const userNotification: InsertDatabaseUserNotification = {
    id: newid(),
    user_id: userId,
    notification_type: 'became_club_manager',
    is_seen: false,
    created_at: new Date(),
    metadata: { club_id: clubId, role: status },
  };
  await Promise.all([
    db.insert(clubs_to_users).values(newRelation),
    db.insert(user_notifications).values(userNotification),
  ]);
};

export const deleteClubManager = async ({
  clubId,
  userId,
}: {
  clubId: string;
  userId: string;
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const authorStatus = await getStatusInClub({
    userId: user.id,
    clubId,
  });
  const targetStatus = await getStatusInClub({
    userId,
    clubId,
  });
  if (targetStatus === 'co-owner') throw new Error('NOT_AUTHORIZED');
  if (authorStatus !== 'co-owner') throw new Error('NOT_AUTHORIZED');
  await db
    .delete(clubs_to_users)
    .where(
      and(
        eq(clubs_to_users.club_id, clubId),
        eq(clubs_to_users.user_id, userId),
      ),
    );
};

export const leaveClub = async (clubId: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const otherClubId = (
    await db
      .select({ club_id: clubs_to_users.club_id })
      .from(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.user_id, user.id),
          ne(clubs_to_users.club_id, clubId),
          eq(clubs_to_users.status, 'co-owner'),
        ),
      )
      .limit(1)
  ).at(0)?.club_id;
  if (!otherClubId) throw new Error('NO_OTHER_CLUB_CO_OWNER');

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ selected_club: otherClubId })
      .where(eq(users.id, user.id));
    await tx
      .delete(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.club_id, clubId),
          eq(clubs_to_users.user_id, user.id),
        ),
      );
  });
};
