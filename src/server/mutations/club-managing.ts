'use server';

import { emptyClubCheck } from '@/app/clubs/create/empty-club-check';
import { validateRequest } from '@/lib/auth/lucia';
import { newid } from '@/lib/utils';
import { db } from '@/server/db';
import {
  clubs,
  clubs_to_users,
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
  InsertDatabasePlayer,
  players,
} from '@/server/db/schema/players';
import {
  games,
  players_to_tournaments,
  tournaments,
} from '@/server/db/schema/tournaments';
import { DatabaseUser, users } from '@/server/db/schema/users';
import { ClubFormType } from '@/server/db/zod/clubs';
import getStatusInClub from '@/server/queries/get-status-in-club';
import { and, eq, ne } from 'drizzle-orm';
import { User } from 'lucia';
import { revalidatePath } from 'next/cache';

export const createClub = async (user: User, values: ClubFormType) => {
  const emptyClub = await emptyClubCheck({ user });
  if (emptyClub) throw new Error('EMPTY_CLUB_EXISTS');

  const id = newid();
  const createdAt = new Date();
  const newClub = {
    ...values,
    id,
    createdAt,
  };
  const newRelation: DatabaseClubsToUsers = {
    id: `${user.id}=${id}`,
    clubId: id,
    userId: user.id,
    status: 'co-owner',
    promotedAt: new Date(),
  };
  try {
    const returnedClub = (
      await db.insert(clubs).values(newClub).returning()
    ).at(0);
    await Promise.all([
      db.insert(clubs_to_users).values(newRelation),
      db.update(users).set({ selectedClub: id }).where(eq(users.id, user.id)),
    ]);
    if (!returnedClub) throw new Error('CLUB_NOT_CREATED');
    return returnedClub;
  } catch (e) {
    throw new Error(`CLUB_NOT_CREATED: ${e}`);
  }
};

export const editClub = async ({
  clubId,
  values,
}: {
  clubId: string;
  values: ClubFormType;
}) => {
  await db.update(clubs).set(values).where(eq(clubs.id, clubId));
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

export const createPlayer = async ({
  player,
}: {
  player: InsertDatabasePlayer;
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const status = await getStatusInClub({
    userId: user.id,
    clubId: player.clubId,
  });
  if (!status) throw new Error('NOT_ADMIN');
  try {
    await db.insert(players).values(player);
  } catch (e) {
    throw new Error(`PLAYER_NOT_CREATED: ${e}`);
  }
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
    .select({ clubId: players.clubId })
    .from(players)
    .where(eq(players.id, playerId));
  if (playerClub.clubId !== clubId) throw new Error('CLUB_ID_NOT_MATCHING');
  const status = await getStatusInClub({
    userId: user.id,
    clubId: playerClub.clubId,
  });
  if (!status) throw new Error('NOT_ADMIN');
  const [playerTournament] = await db
    .select({ tournamentId: players_to_tournaments.tournamentId })
    .from(players_to_tournaments)
    .where(eq(players_to_tournaments.playerId, playerId))
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
    .select({ clubId: players.clubId })
    .from(players)
    .where(eq(players.id, values.id));
  if (playerClub.clubId !== clubId) throw new Error('CLUB_ID_NOT_MATCHING');
  const status = await getStatusInClub({
    userId: user.id,
    clubId: playerClub.clubId,
  });
  if (!status) throw new Error('NOT_ADMIN');
  await db.update(players).set(values).where(eq(players.id, values.id));
  revalidatePath(`/player/${values.id}`);
};

export default async function getAllClubManagers(
  clubId: string,
): Promise<ClubManager[]> {
  return await db
    .select()
    .from(clubs_to_users)
    .where(eq(clubs_to_users.clubId, clubId))
    .innerJoin(users, eq(clubs_to_users.userId, users.id));
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
        eq(clubs_to_users.userId, userId),
        ne(clubs_to_users.clubId, clubId),
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
      .set({ selectedClub: otherClubs[0].clubId })
      .where(eq(users.id, userId));
  }
  await db.batch([
    db
      .delete(games)
      .where(
        eq(
          games.tournamentId,
          db
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.clubId, clubId)),
        ),
      ),
    db
      .delete(players_to_tournaments)
      .where(
        eq(
          players_to_tournaments.tournamentId,
          db
            .select({ id: tournaments.id })
            .from(tournaments)
            .where(eq(tournaments.clubId, clubId)),
        ),
      ),

    db.delete(affiliations).where(eq(affiliations.clubId, clubId)),
    db.delete(club_notifications).where(eq(club_notifications.clubId, clubId)),
    db.delete(players).where(eq(players.clubId, clubId)),
    db.delete(tournaments).where(eq(tournaments.clubId, clubId)),
    db.delete(clubs_to_users).where(eq(clubs_to_users.clubId, clubId)),

    db.delete(clubs).where(eq(clubs.id, clubId)),
  ]);
};

export const getClubAffiliatedUsers = async (clubId: string) => {
  return (
    await db
      .select()
      .from(players)
      .where(eq(players.clubId, clubId))
      .innerJoin(users, eq(players.userId, users.id))
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
      and(eq(clubs_to_users.clubId, clubId), eq(clubs_to_users.userId, userId)),
    );
  if (existingRelation.length > 0) throw new Error('RELATION_EXISTS');
  const newRelation: DatabaseClubsToUsers = {
    id: `${clubId}=${userId}`,
    clubId: clubId,
    userId: userId,
    status,
    promotedAt: new Date(),
  };

  const userNotification: InsertDatabaseUserNotification = {
    id: newid(),
    userId: userId,
    event: 'became_club_manager',
    isSeen: false,
    createdAt: new Date(),
    metadata: { clubId: clubId, role: status },
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
      and(eq(clubs_to_users.clubId, clubId), eq(clubs_to_users.userId, userId)),
    );
};

export const leaveClub = async (clubId: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error('UNAUTHORIZED_REQUEST');
  const otherClubId = (
    await db
      .select({ clubId: clubs_to_users.clubId })
      .from(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.userId, user.id),
          ne(clubs_to_users.clubId, clubId),
          eq(clubs_to_users.status, 'co-owner'),
        ),
      )
      .limit(1)
  ).at(0)?.clubId;
  if (!otherClubId) throw new Error('NO_OTHER_CLUB_CO_OWNER');

  await db.transaction(async (tx) => {
    await tx
      .update(users)
      .set({ selectedClub: otherClubId })
      .where(eq(users.id, user.id));
    await tx
      .delete(clubs_to_users)
      .where(
        and(
          eq(clubs_to_users.clubId, clubId),
          eq(clubs_to_users.userId, user.id),
        ),
      );
  });
};
